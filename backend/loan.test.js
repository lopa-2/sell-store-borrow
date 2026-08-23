import { describe, it, expect } from "vitest";
import { calculateLoanOffer } from "./loan.js";

describe("calculateLoanOffer", () => {
  it("uses a 70% LTV for perishable crops", () => {
    const offer = calculateLoanOffer(10, 1000, { perishable: true });
    expect(offer.totalCropValue).toBe(10000);
    expect(offer.loanAmount).toBe(7000);
  });

  it("uses an 80% LTV for non-perishable crops", () => {
    const offer = calculateLoanOffer(10, 1000, { perishable: false });
    expect(offer.loanAmount).toBe(8000);
  });
});
