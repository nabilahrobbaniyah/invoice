const SORT_MAP = {
  name: "clients.name",
  created_at: "clients.created_at"
};

async function listClients(userId, sort) {
  const orderBy = SORT_MAP[sort] || SORT_MAP.name;

  return repo.findByUser(userId, orderBy);
}
