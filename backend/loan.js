export function calculateLoanOffer(quantityQuintals, currentPricePerQuintal, cropProfile) {
  const totalCropValue = quantityQuintals * currentPricePerQuintal;
  const ltvRatio = cropProfile.perishable ? 0.7 : 0.8;
  const loanAmount = Math.round(totalCropValue * ltvRatio);
  const annualInterestRate = 9;
  const processingFee = Math.round(loanAmount * 0.005);

  return {
    totalCropValue,
    loanAmount,
    ltvPercent: ltvRatio * 100,
    annualInterestRate,
    processingFee,
    disbursalHours: 48,
  };
}