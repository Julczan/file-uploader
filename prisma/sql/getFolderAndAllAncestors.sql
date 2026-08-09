-- @param {String} $1:organisationId
WITH RECURSIVE childFolder(id, depth) AS (
  SELECT 
    id, 0
  FROM 
    "Folder"
  WHERE 
    id = $1
  UNION 
  SELECT 
    parentFolder."parentFolderId", depth + 1
  FROM 
     "Folder" parentFolder
    INNER JOIN childFolder cf ON cf.id = parentFolder.id
) 
SELECT * FROM childFolder ORDER BY depth DESC;