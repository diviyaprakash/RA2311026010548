const TYPE_PRIORITY = { Placement: 3, Result: 2, Event: 1 };

export function getPriorityInbox(notifications) {
  return notifications
    .slice()
    .sort((a, b) => {
      const pa = TYPE_PRIORITY[a.type] ?? 0;
      const pb = TYPE_PRIORITY[b.type] ?? 0;
      if (pb !== pa) return pb - pa;
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 10);
}
