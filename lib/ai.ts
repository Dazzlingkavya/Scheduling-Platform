type SlotForSuggestion = {
  _id: string;
  date: string;
  startTime: string | Date;
  endTime: string | Date;
};

export function suggestBestMeetingSlot(slots: SlotForSuggestion[]) {
  if (!slots.length) {
    return null;
  }

  const now = Date.now();

  const ranked = [...slots].sort((left, right) => {
    const leftStart = new Date(left.startTime).getTime();
    const rightStart = new Date(right.startTime).getTime();
    const scoreLeft = getSlotScore(leftStart);
    const scoreRight = getSlotScore(rightStart);

    if (scoreLeft !== scoreRight) {
      return scoreRight - scoreLeft;
    }

    return leftStart - rightStart;
  });

  function getSlotScore(startTime: number) {
    const date = new Date(startTime);
    const hour = date.getUTCHours();
    const day = date.getUTCDay();
    let score = 0;

    if (startTime > now) score += 25;
    if (day >= 1 && day <= 4) score += 20;
    if (hour >= 13 && hour <= 17) score += 30;
    if (hour >= 9 && hour <= 12) score += 20;
    if (day === 5) score += 8;

    return score;
  }

  return {
    slotId: ranked[0]._id,
    reasoning:
      "This slot is prioritized because it falls in a high-attendance window on a working day and is still upcoming.",
    slot: ranked[0]
  };
}
