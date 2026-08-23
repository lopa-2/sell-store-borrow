export function speakRecommendation(data) {
  if (!("speechSynthesis" in window)) return;
  const text = `Recommendation: ${data.recommendation.headline}. ${data.recommendation.reason} Your crop is safe to store for ${data.spoilageRisk.daysRemaining} more days. If you choose to borrow instead, you can get ${data.loanOffer.loanAmount} rupees within ${data.loanOffer.disbursalHours} hours.`;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}