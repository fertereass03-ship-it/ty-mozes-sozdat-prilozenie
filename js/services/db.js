/**
 * IndexedDB wrapper for AI App Builder persistent storage.
 * Provides CRUD operations for users, projects, files, API keys,
 * chat history, settings, and version management.
 */

import { CryptoService } from './crypto.js';

class AppDB {
  constructor() {
    this.dbName = 'AIAppBuilder';
    this.version = 3;
    this.db = null;
  }

  /**
   * Open (or upgrade) the IndexedDB database.
   * Creates all required object stores and indexes.
   * @returns {Promise<IDBDatabase>}
   */
  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const oldVersion = event.oldVersion;

        // ── Version 1: core stores ──────────────────────────────────
        if (oldVersion < 1) {
          // Users
          const usersStore = db.createObjectStore('users', { keyPath: 'id' });
          usersStore.createIndex('email', 'email', { unique: true });
          usersStore.createIndex('createdAt', 'createdAt', { unique: false });

          // Projects
          const projectsStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectsStore.createIndex('userId', 'userId', { unique: false });
          projectsStore.createIndex('status', 'status', { unique: false });
          projectsStore.createIndex('createdAt', 'createdAt', { unique: false });
          projectsStore.createIndex('userId_status', ['userId', 'status'], { unique: false });

          // Project Files – compound key [projectId, path]
          const filesStore = db.createObjectStore('projectFiles', { keyPath: ['projectId', 'path'] });
          filesStore.createIndex('projectId', 'projectId', { unique: false });
          filesStore.createIndex('type', 'type', { unique: false });
          filesStore.createIndex('projectId_type', ['projectId', 'type'], { unique: false });

          // API Keys – compound key [userId, provider]
          const apiKeysStore = db.createObjectStore('apiKeys', { keyPath: ['userId', 'provider'] });
          apiKeysStore.createIndex('userId', 'userId', { unique: false });

          // Chat History
          const chatStore = db.createObjectStore('chatHistory', { keyPath: 'id' });
          chatStore.createIndex('projectId', 'projectId', { unique: false });
          chatStore.createIndex('timestamp', 'timestamp', { unique: false });
          chatStore.createIndex('projectId_timestamp', ['projectId', 'timestamp'], { unique: false });

          // Settings – one record per user
          db.createObjectStore('settings', { keyPath: 'userId' });
        }

        // ── Version 2: versions store ───────────────────────────────
        if (oldVersion < 2) {
          const versionsStore = db.createObjectStore('versions', { keyPath: 'id' });
          versionsStore.createIndex('projectId', 'projectId', { unique: false });
          versionsStore.createIndex('timestamp', 'timestamp', { unique: false });
          versionsStore.createIndex('projectId_timestamp', ['projectId', 'timestamp'], { unique: false });
        }

        // ── Version 3: additional indexes for performance ───────────
        if (oldVersion < 3) {
          // Add updatedAt index to projects if the store exists
          if (event.target.transaction) {
            const projectsStore = event.target.transaction.objectStore('projects');
            if (!projectsStore.indexNames.contains('updatedAt')) {
              projectsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
            }
          }
        }
      };
    });
  }

  /**
   * Ensure the database is initialized before any operation.
   * @returns {Promise<IDBDatabase>}
   */
  async _ensureDB() {
    if (!this.db) await this.init();
    return this.db;
  }

  /**
   * Generic helper: execute a single-store transaction.
   * @param {string} storeName
   * @param {'readonly'|'readwrite'} mode
   * @param {function(IDBObjectStore): IDBRequest|void} callback
   * @returns {Promise<*>}
   */
  _tx(storeName, mode, callback) {
    return new Promise(async (resolve, reject) => {
      const db = await this._ensureDB();
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      let result;

      try {
        result = callback(store);
      } catch (err) {
        reject(err);
        return;
      }

      tx.oncomplete = () => {
        if (result instanceof IDBRequest) {
          resolve(result.result);
        } else {
          resolve(result);
        }
      };

      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
    });
  }

  /**
   * Helper for multi-store transactions.
   * @param {string[]} storeNames
   * @param {'readonly'|'readwrite'} mode
   * @param {function(Object<string, IDBObjectStore>): void} callback
   * @returns {Promise<void>}
   */
  _txMulti(storeNames, mode, callback) {
    return new Promise(async (resolve, reject) => {
      const db = await this._ensureDB();
      const tx = db.transaction(storeNames, mode);
      const stores = {};
      for (const name of storeNames) {
        stores[name] = tx.objectStore(name);
      }

      try {
        callback(stores);
      } catch (err) {
        reject(err);
        return;
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
    });
  }

  /**
   * Collect all results from an IDBRequest opened on an index or store.
   * @param {IDBRequest} request
   * @returns {Promise<Array>}
   */
  _getAllFromRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // ════════════════════════════════════════════════════════════════
  //  USER METHODS
  // ════════════════════════════════════════════════════════════════

  /**
   * Create a new user record.
   * @param {Object} user - Must include at least { email, name }.
   * @returns {Promise<Object>} The created user (with generated id/timestamps).
   */
  async createUser(user) {
    const record = {
      id: user.id || CryptoService.generateId(),
      email: user.email,
      name: user.name,
      avatar: user.avatar || null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...user,
    };
    record.id = record.id || CryptoService.generateId();
    record.createdAt = record.createdAt || Date.now();
    record.updatedAt = Date.now();

    await this._tx('users', 'readwrite', (store) => store.put(record));
    return record;
  }

  /**
   * Get a user by id.
   * @param {string} id
   * @returns {Promise<Object|undefined>}
   */
  async getUser(id) {
    return this._tx('users', 'readonly', (store) => store.get(id));
  }

  /**
   * Get a user by email address.
   * @param {string} email
   * @returns {Promise<Object|undefined>}
   */
  async getUserByEmail(email) {
    return new Promise(async (resolve, reject) => {
      const db = await this._ensureDB();
      const tx = db.transaction('users', 'readonly');
      const store = tx.objectStore('users');
      const index = store.index('email');
      const request = index.get(email);

      request.onsuccess = () => resolve(request.result || undefined);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Partially update a user record.
   * @param {string} id
   * @param {Object} data - Fields to merge.
   * @returns {Promise<Object>} The updated user.
   */
  async updateUser(id, data) {
    const existing = await this.getUser(id);
    if (!existing) throw new Error(`User ${id} not found`);

    const updated = { ...existing, ...data, id, updatedAt: Date.now() };
    await this._tx('users', 'readwrite', (store) => store.put(updated));
    return updated;
  }

  // ════════════════════════════════════════════════════════════════
  //  PROJECT METHODS
  // ════════════════════════════════════════════════════════════════

  /**
   * Create a new project.
   * @param {Object} project
   * @returns {Promise<Object>} The created project.
   */
  async createProject(project) {
    const record = {
      id: project.id || CryptoService.generateId(),
      userId: project.userId,
      name: project.name || 'Untitled Project',
      type: project.type || 'web',
      techStack: project.techStack || [],
      description: project.description || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: project.status || 'active',
      ...project,
    };
    record.id = record.id || CryptoService.generateId();
    record.createdAt = record.createdAt || Date.now();
    record.updatedAt = Date.now();

    await this._tx('projects', 'readwrite', (store) => store.put(record));
    return record;
  }

  /**
   * Get a single project by id.
   * @param {string} id
   * @returns {Promise<Object|undefined>}
   */
  async getProject(id) {
    return this._tx('projects', 'readonly', (store) => store.get(id));
  }

  /**
   * Get all projects for a given user, sorted newest-first.
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getUserProjects(userId) {
    return new Promise(async (resolve, reject) => {
      const db = await this._ensureDB();
      const tx = db.transaction('projects', 'readonly');
      const store = tx.objectStore('projects');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const results = (request.result || []).sort(
          (a, b) => b.updatedAt - a.updatedAt
        );
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Partially update a project.
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateProject(id, data) {
    const existing = await this.getProject(id);
    if (!existing) throw new Error(`Project ${id} not found`);

    const updated = { ...existing, ...data, id, updatedAt: Date.now() };
    await this._tx('projects', 'readwrite', (store) => store.put(updated));
    return updated;
  }

  /**
   * Delete a project and all its related files and chat history.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteProject(id) {
    const db = await this._ensureDB();

    // Collect IDs of related records first
    const filesToDelete = await this._getKeysByIndex('projectFiles', 'projectId', id);
    const chatToDelete = await this._getKeysByIndex('chatHistory', 'projectId', id);
    const versionsToDelete = await this._getKeysByIndex('versions', 'projectId', id);

    return new Promise((resolve, reject) => {
      const tx = db.transaction(
        ['projects', 'projectFiles', 'chatHistory', 'versions'],
        'readwrite'
      );

      tx.objectStore('projects').delete(id);

      const filesStore = tx.objectStore('projectFiles');
      for (const key of filesToDelete) {
        filesStore.delete(key);
      }

      const chatStore = tx.objectStore('chatHistory');
      for (const key of chatToDelete) {
        chatStore.delete(key);
      }

      const versionsStore = tx.objectStore('versions');
      for (const key of versionsToDelete) {
        versionsStore.delete(key);
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Delete transaction aborted'));
    });
  }

  /**
   * Helper: get all primary keys matching an index value.
   * @param {string} storeName
   * @param {string} indexName
   * @param {*} value
   * @returns {Promise<Array>}
   */
  async _getKeysByIndex(storeName, indexName, value) {
    return new Promise(async (resolve, reject) => {
      const db = await this._ensureDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const keys = [];

      const request = index.openKeyCursor(IDBKeyRange.only(value));
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          keys.push(cursor.primaryKey);
          cursor.continue();
        } else {
          resolve(keys);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Deep-copy a project: duplicates the project record, all files,
   * and all chat history with new IDs.
   * @param {string} id - The source project id.
   * @returns {Promise<Object>} The new duplicated project.
   */
  async duplicateProject(id) {
    const original = await this.getProject(id);
    if (!original) throw new Error(`Project ${id} not found`);

    const newId = CryptoService.generateId();
    const now = Date.now();

    // Clone project
    const newProject = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };

    // Clone files
    const files = await this.getAllFiles(id);
    const newFiles = files.map((file) => ({
      ...file,
      projectId: newId,
    }));

    // Clone chat history
    const chat = await this.getChatHistory(id);
    const newChat = chat.map((msg) => ({
      ...msg,
      id: CryptoService.generateId(),
      projectId: newId,
    }));

    // Write everything in one transaction
    const db = await this._ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(
        ['projects', 'projectFiles', 'chatHistory'],
        'readwrite'
      );

      tx.objectStore('projects').put(newProject);

      const filesStore = tx.objectStore('projectFiles');
      for (const file of newFiles) {
        filesStore.put(file);
      }

      const chatStore = tx.objectStore('chatHistory');
      for (const msg of newChat) {
        chatStore.put(msg);
      }

      tx.oncomplete = () => resolve(newProject);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Duplicate transaction aborted'));
    });
  }

  // ════════════════════════════════════════════════════════════════
  //  FILE METHODS
  // ════════════════════════════════════════════════════════════════

  /**
   * Save (upsert) a file for a project.
   * @param {string} projectId
   * @param {string} path - Virtual file path, e.g. "src/index.js"
   * @param {string} content - File content.
   * @param {string} [type='text'] - MIME-ish type hint ('text', 'binary', 'image', etc.)
   * @returns {Promise<Object>} The saved file record.
   */
  async saveFile(projectId, path, content, type = 'text') {
    const record = {
      projectId,
      path,
      content,
      type,
      size: typeof content === 'string' ? content.length : 0,
      updatedAt: Date.now(),
    };

    await this._tx('projectFiles', 'readwrite', (store) => store.put(record));

    // Touch the parent project's updatedAt
    try {
      await this.updateProject(projectId, {});
    } catch (_) {
      // Project might not exist yet during bulk import; ignore
    }

    return record;
  }

  /**
   * Get a single file by projectId and path.
   * @param {string} projectId
   * @param {string} path
   * @returns {Promise<Object|undefined>}
   */
  async getFile(projectId, path) {
    return this._tx('projectFiles', 'readonly', (store) =>
      store.get([projectId, path])
    );
  }

  /**
   * Get all files for a project as a hierarchical tree structure.
   * @param {string} projectId
   * @returns {Promise<Object>} Tree object: { name, type, children, path }
   */
  async getProjectFiles(projectId) {
    const files = await this.getAllFiles(projectId);
    const root = { name: '/', type: 'folder', children: [], path: '' };

    for (const file of files) {
      const parts = file.path.split('/').filter(Boolean);
      let current = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        const currentPath = parts.slice(0, i + 1).join('/');

        if (isFile) {
          current.children.push({
            name: part,
            type: 'file',
            fileType: file.type,
            path: file.path,
            size: file.size,
            updatedAt: file.updatedAt,
          });
        } else {
          let folder = current.children.find(
            (c) => c.name === part && c.type === 'folder'
          );
          if (!folder) {
            folder = { name: part, type: 'folder', children: [], path: currentPath };
            current.children.push(folder);
          }
          current = folder;
        }
      }
    }

    // Sort: folders first, then alphabetically
    const sortTree = (node) => {
      if (node.children) {
        node.children.sort((a, b) => {
          if (a.type === 'folder' && b.type !== 'folder') return -1;
          if (a.type !== 'folder' && b.type === 'folder') return 1;
          return a.name.localeCompare(b.name);
        });
        node.children.forEach(sortTree);
      }
    };
    sortTree(root);

    return root;
  }

  /**
   * Delete a single file.
   * @param {string} projectId
   * @param {string} path
   * @returns {Promise<void>}
   */
  async deleteFile(projectId, path) {
    await this._tx('projectFiles', 'readwrite', (store) =>
      store.delete([projectId, path])
    );
  }

  /**
   * Rename / move a file.
   * @param {string} projectId
   * @param {string} oldPath
   * @param {string} newPath
   * @returns {Promise<Object>} The file record at its new path.
   */
  async renameFile(projectId, oldPath, newPath) {
    const file = await this.getFile(projectId, oldPath);
    if (!file) throw new Error(`File not found: ${oldPath}`);

    const db = await this._ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projectFiles', 'readwrite');
      const store = tx.objectStore('projectFiles');

      store.delete([projectId, oldPath]);

      const newRecord = { ...file, path: newPath, updatedAt: Date.now() };
      store.put(newRecord);

      tx.oncomplete = () => resolve(newRecord);
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Get all files for a project as a flat array.
   * @param {string} projectId
   * @returns {Promise<Array>}
   */
  async getAllFiles(projectId) {
    return new Promise(async (resolve, reject) => {
      const db = await this._ensureDB();
      const tx = db.transaction('projectFiles', 'readonly');
      const store = tx.objectStore('projectFiles');
      const index = store.index('projectId');
      const request = index.getAll(projectId);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // ════════════════════════════════════════════════════════════════
  //  API KEYS
  // ════════════════════════════════════════════════════════════════

  /**
   * Save an API key for a provider.
   * @param {string} userId
   * @param {string} provider - e.g. "openai", "anthropic", "google"
   * @param {string} encryptedKey - Already-encrypted key data.
   * @param {Object} [settings={}] - Provider-specific settings.
   * @returns {Promise<Object>}
   */
  async saveApiKey(userId, provider, encryptedKey, settings = {}) {
    const record = {
      userId,
      provider,
      encryptedKey,
      settings,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await this._tx('apiKeys', 'readwrite', (store) => store.put(record));
    return record;
  }

  /**
   * Get all API keys for a user.
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getApiKeys(userId) {
    return new Promise(async (resolve, reject) => {
      const db = await this._ensureDB();
      const tx = db.transaction('apiKeys', 'readonly');
      const store = tx.objectStore('apiKeys');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete an API key.
   * @param {string} userId
   * @param {string} provider
   * @returns {Promise<void>}
   */
  async deleteApiKey(userId, provider) {
    await this._tx('apiKeys', 'readwrite', (store) =>
      store.delete([userId, provider])
    );
  }

  /**
   * Update settings on an existing API key.
   * @param {string} userId
   * @param {string} provider
   * @param {Object} settings
   * @returns {Promise<Object>}
   */
  async updateApiKeySettings(userId, provider, settings) {
    return new Promise(async (resolve, reject) => {
      const db = await this._ensureDB();
      const tx = db.transaction('apiKeys', 'readwrite');
      const store = tx.objectStore('apiKeys');
      const getReq = store.get([userId, provider]);

      getReq.onsuccess = () => {
        const existing = getReq.result;
        if (!existing) {
          reject(new Error(`API key not found for ${provider}`));
          return;
        }

        const updated = {
          ...existing,
          settings: { ...existing.settings, ...settings },
          updatedAt: Date.now(),
        };
        store.put(updated);

        tx.oncomplete = () => resolve(updated);
      };
      getReq.onerror = () => reject(getReq.error);
      tx.onerror = () => reject(tx.error);
    });
  }

  // ════════════════════════════════════════════════════════════════
  //  CHAT HISTORY
  // ════════════════════════════════════════════════════════════════

  /**
   * Append a chat message to a project's history.
   * @param {string} projectId
   * @param {Object} message - { role, content, timestamp?, files? }
   * @returns {Promise<Object>} The stored message (with generated id).
   */
  async addChatMessage(projectId, message) {
    const record = {
      id: CryptoService.generateId(),
      projectId,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp || Date.now(),
      files: message.files || [],
      metadata: message.metadata || null,
    };

    await this._tx('chatHistory', 'readwrite', (store) => store.put(record));
    return record;
  }

  /**
   * Get all chat messages for a project, in chronological order.
   * @param {string} projectId
   * @returns {Promise<Array>}
   */
  async getChatHistory(projectId) {
    return new Promise(async (resolve, reject) => {
      const db = await this._ensureDB();
      const tx = db.transaction('chatHistory', 'readonly');
      const store = tx.objectStore('chatHistory');
      const index = store.index('projectId');
      const request = index.getAll(projectId);

      request.onsuccess = () => {
        const results = (request.result || []).sort(
          (a, b) => a.timestamp - b.timestamp
        );
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all chat history for a project.
   * @param {string} projectId
   * @returns {Promise<void>}
   */
  async clearChatHistory(projectId) {
    const keys = await this._getKeysByIndex('chatHistory', 'projectId', projectId);

    await this._tx('chatHistory', 'readwrite', (store) => {
      for (const key of keys) {
        store.delete(key);
      }
    });
  }

  // ════════════════════════════════════════════════════════════════
  //  SETTINGS
  // ════════════════════════════════════════════════════════════════

  /**
   * Save (upsert) user settings.
   * @param {string} userId
   * @param {Object} settings
   * @returns {Promise<Object>}
   */
  async saveSettings(userId, settings) {
    const record = {
      userId,
      ...settings,
      updatedAt: Date.now(),
    };

    await this._tx('settings', 'readwrite', (store) => store.put(record));
    return record;
  }

  /**
   * Get user settings.
   * @param {string} userId
   * @returns {Promise<Object|undefined>}
   */
  async getSettings(userId) {
    return this._tx('settings', 'readonly', (store) => store.get(userId));
  }

  // ════════════════════════════════════════════════════════════════
  //  VERSIONS
  // ════════════════════════════════════════════════════════════════

  /**
   * Save a version snapshot for a project.
   * @param {string} projectId
   * @param {Object} version - { id?, timestamp?, files, description }
   * @returns {Promise<Object>}
   */
  async saveVersion(projectId, version) {
    const record = {
      id: version.id || CryptoService.generateId(),
      projectId,
      timestamp: version.timestamp || Date.now(),
      files: version.files || [],
      description: version.description || '',
      metadata: version.metadata || null,
    };

    await this._tx('versions', 'readwrite', (store) => store.put(record));
    return record;
  }

  /**
   * Get all versions for a project, newest-first.
   * @param {string} projectId
   * @returns {Promise<Array>}
   */
  async getVersions(projectId) {
    return new Promise(async (resolve, reject) => {
      const db = await this._ensureDB();
      const tx = db.transaction('versions', 'readonly');
      const store = tx.objectStore('versions');
      const index = store.index('projectId');
      const request = index.getAll(projectId);

      request.onsuccess = () => {
        const results = (request.result || []).sort(
          (a, b) => b.timestamp - a.timestamp
        );
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Restore a project to a specific version: replaces all project files
   * with the snapshot stored in that version.
   * @param {string} projectId
   * @param {string} versionId
   * @returns {Promise<void>}
   */
  async restoreVersion(projectId, versionId) {
    // Fetch the version
    const version = await this._tx('versions', 'readonly', (store) =>
      store.get(versionId)
    );
    if (!version) throw new Error(`Version ${versionId} not found`);
    if (version.projectId !== projectId) {
      throw new Error('Version does not belong to this project');
    }

    // Save a backup of the current state before restoring
    const currentFiles = await this.getAllFiles(projectId);
    await this.saveVersion(projectId, {
      files: currentFiles,
      description: `Auto-backup before restoring version ${versionId}`,
    });

    // Delete all current files, then write the version's files
    const currentKeys = await this._getKeysByIndex('projectFiles', 'projectId', projectId);

    const db = await this._ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projectFiles', 'readwrite');
      const store = tx.objectStore('projectFiles');

      // Remove current files
      for (const key of currentKeys) {
        store.delete(key);
      }

      // Write restored files
      for (const file of version.files) {
        store.put({
          ...file,
          projectId,
          updatedAt: Date.now(),
        });
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Restore transaction aborted'));
    });
  }
}

export const db = new AppDB();
