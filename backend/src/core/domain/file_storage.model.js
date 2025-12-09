import { pool } from '../../infrastructure/database/db.js';

/**
 * Create file record
 */
export async function createFileRecord({
  userId,
  fileName,
  originalName,
  filePath,
  fileSize,
  mimeType,
  fileType = 'document',
  relatedTable = null,
  relatedId = null,
}) {
  const [result] = await pool.execute(
    `
    INSERT INTO file_storage (
      user_id, file_name, original_name, file_path, file_size, 
      mime_type, file_type, related_table, related_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      userId,
      fileName,
      originalName,
      filePath,
      fileSize,
      mimeType,
      fileType,
      relatedTable,
      relatedId,
    ]
  );

  return result.insertId;
}

/**
 * Get file by ID
 */
export async function getFileById(id) {
  const [rows] = await pool.execute(
    `
    SELECT * FROM file_storage WHERE id = ?
  `,
    [id]
  );

  return rows[0] || null;
}

/**
 * Get files by user
 */
export async function getFilesByUser(userId, filters = {}) {
  let query = `
    SELECT * FROM file_storage 
    WHERE user_id = ?
  `;

  const params = [userId];

  if (filters.type) {
    query += ' AND file_type = ?';
    params.push(filters.type);
  }

  if (filters.relatedTable) {
    query += ' AND related_table = ?';
    params.push(filters.relatedTable);
  }

  if (filters.relatedId) {
    query += ' AND related_id = ?';
    params.push(filters.relatedId);
  }

  query += ' ORDER BY created_at DESC';

  const [rows] = await pool.execute(query, params);
  return rows;
}

/**
 * Get files by related record
 */
export async function getFilesByRelatedRecord(relatedTable, relatedId) {
  const [rows] = await pool.execute(
    `
    SELECT * FROM file_storage 
    WHERE related_table = ? AND related_id = ?
    ORDER BY created_at DESC
  `,
    [relatedTable, relatedId]
  );

  return rows;
}

/**
 * Get all files (admin only)
 */
export async function getAllFiles(filters = {}) {
  let query = `
    SELECT fs.*, u.name as user_name, u.email as user_email
    FROM file_storage fs
    LEFT JOIN users u ON fs.user_id = u.id
    WHERE 1=1
  `;

  const params = [];

  if (filters.userId) {
    query += ' AND fs.user_id = ?';
    params.push(filters.userId);
  }

  if (filters.type) {
    query += ' AND fs.file_type = ?';
    params.push(filters.type);
  }

  if (filters.relatedTable) {
    query += ' AND fs.related_table = ?';
    params.push(filters.relatedTable);
  }

  if (filters.dateFrom) {
    query += ' AND fs.created_at >= ?';
    params.push(filters.dateFrom);
  }

  if (filters.dateTo) {
    query += ' AND fs.created_at <= ?';
    params.push(filters.dateTo);
  }

  query += ' ORDER BY fs.created_at DESC';

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(parseInt(filters.limit));
  }

  if (filters.offset) {
    query += ' OFFSET ?';
    params.push(parseInt(filters.offset));
  }

  const [rows] = await pool.execute(query, params);
  return rows;
}

/**
 * Update file record
 */
export async function updateFileRecord(id, updates) {
  const allowedFields = [
    'file_name',
    'original_name',
    'file_path',
    'file_size',
    'mime_type',
    'file_type',
  ];
  const updateFields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key) && value !== undefined) {
      updateFields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (updateFields.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(id);

  const [result] = await pool.execute(
    `
    UPDATE file_storage 
    SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
    values
  );

  return result.affectedRows > 0;
}

/**
 * Delete file record
 */
export async function deleteFileRecord(id) {
  const [result] = await pool.execute(
    `
    DELETE FROM file_storage WHERE id = ?
  `,
    [id]
  );

  return result.affectedRows > 0;
}

/**
 * Delete files by related record
 */
export async function deleteFilesByRelatedRecord(relatedTable, relatedId) {
  const [result] = await pool.execute(
    `
    DELETE FROM file_storage 
    WHERE related_table = ? AND related_id = ?
  `,
    [relatedTable, relatedId]
  );

  return result.affectedRows;
}

/**
 * Get file statistics
 */
export async function getFileStatistics() {
  const [rows] = await pool.execute(`
    SELECT 
      file_type,
      COUNT(*) as count,
      SUM(file_size) as total_size,
      AVG(file_size) as avg_size
    FROM file_storage 
    GROUP BY file_type
  `);

  return rows;
}

/**
 * Get files by date range
 */
export async function getFilesByDateRange(startDate, endDate) {
  const [rows] = await pool.execute(
    `
    SELECT fs.*, u.name as user_name, u.email as user_email
    FROM file_storage fs
    LEFT JOIN users u ON fs.user_id = u.id
    WHERE fs.created_at BETWEEN ? AND ?
    ORDER BY fs.created_at DESC
  `,
    [startDate, endDate]
  );

  return rows;
}

/**
 * Get storage usage by user
 */
export async function getStorageUsageByUser(userId) {
  const [rows] = await pool.execute(
    `
    SELECT 
      COUNT(*) as file_count,
      SUM(file_size) as total_size,
      AVG(file_size) as avg_size,
      MAX(file_size) as max_size,
      MIN(file_size) as min_size
    FROM file_storage 
    WHERE user_id = ?
  `,
    [userId]
  );

  return (
    rows[0] || {
      file_count: 0,
      total_size: 0,
      avg_size: 0,
      max_size: 0,
      min_size: 0,
    }
  );
}

/**
 * Clean up orphaned files
 */
export async function cleanupOrphanedFiles() {
  // This function would be used to clean up files that are no longer referenced
  // Implementation depends on business rules for file retention
  const [rows] = await pool.execute(`
    SELECT fs.* FROM file_storage fs
    LEFT JOIN users u ON fs.user_id = u.id
    WHERE u.id IS NULL
  `);

  const orphanedFiles = rows;
  let deletedCount = 0;

  for (const file of orphanedFiles) {
    try {
      // Delete file from disk
      const fs = await import('fs');
      if (fs.existsSync(file.file_path)) {
        fs.unlinkSync(file.file_path);
      }

      // Delete file record
      await deleteFileRecord(file.id);
      deletedCount++;
    } catch (error) {
      console.error(`Error cleaning up file ${file.id}:`, error);
    }
  }

  return {
    orphanedFiles: orphanedFiles.length,
    deletedFiles: deletedCount,
  };
}

/**
 * Get file download history
 */
export async function getFileDownloadHistory(fileId) {
  // This would require a separate table to track downloads
  // For now, we'll return basic file info
  const file = await getFileById(fileId);
  if (!file) {
    return null;
  }

  return {
    file: {
      id: file.id,
      fileName: file.file_name,
      originalName: file.original_name,
      fileSize: file.file_size,
      mimeType: file.mime_type,
      createdAt: file.created_at,
    },
    downloads: [], // Would be populated from download tracking table
  };
}
