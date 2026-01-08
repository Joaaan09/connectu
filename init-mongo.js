db.getSiblingDB("mernapp").createUser({
  user: "mernuser",
  pwd: "secret123",
  roles: [
    {
      role: "readWrite",
      db: "mernapp"
    }
  ]
});