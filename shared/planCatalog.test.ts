import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  annualPlanSavingsPercent,
  hasOpenNotifications,
  hasPremiumFeatures,
  hostedAiMonthlyLimit,
  normalizeAccountType,
  planDefinitionFor,
  planFeaturesFor,
  planPriceFor,
} from "./planCatalog";

describe("planCatalog", () => {
  it("normalizes legacy plan ids", () => {
    assert.equal(normalizeAccountType("pro"), "personal_premium");
    assert.equal(normalizeAccountType("premium"), "personal_premium");
    assert.equal(normalizeAccountType("starter"), "personal_premium");
    assert.equal(normalizeAccountType("business"), "business_premium");
    assert.equal(normalizeAccountType("plus"), "business_premium");
    assert.equal(normalizeAccountType(undefined), "free");
  });

  it("sets launch pricing and labels", () => {
    assert.equal(planDefinitionFor("free").label, "Free");
    assert.equal(planDefinitionFor("personal_premium").label, "Starter");
    assert.equal(planDefinitionFor("personal_premium").priceMonthlyUsd, 4);
    assert.equal(planDefinitionFor("personal_premium").priceYearlyUsd, 40);
    assert.equal(planDefinitionFor("personal_premium").priceMonthlyEur, 4);
    assert.equal(planDefinitionFor("personal_premium").priceYearlyEur, 40);
    assert.equal(planDefinitionFor("business_premium").label, "Business");
    assert.equal(planDefinitionFor("business_premium").priceMonthlyUsd, 12);
    assert.equal(planDefinitionFor("business_premium").priceYearlyUsd, 120);
    assert.equal(planDefinitionFor("business_premium").priceMonthlyEur, 12);
    assert.equal(planDefinitionFor("business_premium").priceYearlyEur, 120);
  });

  it("gives both paid plans two months free with annual billing", () => {
    for (const accountType of ["personal_premium", "business_premium"] as const) {
      const plan = planDefinitionFor(accountType);
      assert.equal(plan.priceYearlyUsd, plan.priceMonthlyUsd * 10);
      assert.equal(plan.priceYearlyEur, plan.priceMonthlyEur * 10);
      assert.equal(annualPlanSavingsPercent(accountType, "usd"), 17);
      assert.equal(annualPlanSavingsPercent(accountType, "eur"), 17);
    }
  });

  it("returns fixed regional prices without client-side conversion", () => {
    assert.equal(planPriceFor("personal_premium", "usd", "month"), 4);
    assert.equal(planPriceFor("personal_premium", "eur", "year"), 40);
    assert.equal(planPriceFor("business_premium", "usd", "year"), 120);
    assert.equal(planPriceFor("business_premium", "eur", "month"), 12);
  });

  it("sets monthly hosted AI limits", () => {
    assert.equal(hostedAiMonthlyLimit("free"), 3);
    assert.equal(hostedAiMonthlyLimit("personal_premium"), 50);
    assert.equal(hostedAiMonthlyLimit("business_premium"), 300);
  });

  it("tiers attachment and active payload buffer limits", () => {
    const free = planFeaturesFor("free");
    const starter = planFeaturesFor("personal_premium");
    const business = planFeaturesFor("business_premium");
    assert.equal(free.attachmentMaxBytes, 25 * 1024 * 1024);
    assert.equal(starter.attachmentMaxBytes, 250 * 1024 * 1024);
    assert.equal(business.attachmentMaxBytes, 1024 * 1024 * 1024);
    assert.equal(free.activePayloadBufferBytes, 250 * 1024 * 1024);
    assert.equal(starter.activePayloadBufferBytes, 5 * 1024 * 1024 * 1024);
    assert.equal(business.activePayloadBufferBytes, 50 * 1024 * 1024 * 1024);
    assert.equal(free.maxFileAccessWindowSeconds, 15 * 60);
    assert.equal(starter.maxFileAccessWindowSeconds, 30 * 60);
    assert.equal(business.maxFileAccessWindowSeconds, 60 * 60);
    assert.equal(free.maxVoiceMessageSeconds, 5 * 60);
    assert.equal(starter.maxVoiceMessageSeconds, 15 * 60);
    assert.equal(business.maxVoiceMessageSeconds, 30 * 60);
  });

  it("enables workflow on Starter and branding on Business", () => {
    assert.equal(planDefinitionFor("free").features.proofOfAccess, false);
    assert.equal(planDefinitionFor("personal_premium").features.proofOfAccess, true);
    assert.equal(planFeaturesFor("personal_premium").revealBranding, false);
    assert.equal(planFeaturesFor("personal_premium").premiumTemplatePacks, true);
    assert.equal(planFeaturesFor("personal_premium").customPromptTemplates, false);
    assert.equal(planFeaturesFor("business_premium").revealBranding, true);
    assert.equal(planFeaturesFor("business_premium").premiumTemplatePacks, true);
    assert.equal(planFeaturesFor("business_premium").customPromptTemplates, true);
    assert.equal(planFeaturesFor("personal_premium").noteLabelPortability, false);
    assert.equal(planFeaturesFor("business_premium").noteLabelPortability, true);
    assert.equal(planFeaturesFor("free").premiumTemplatePacks, false);
    assert.equal(planFeaturesFor("free").customPromptTemplates, false);
    assert.equal(planFeaturesFor("free").noteLabelPortability, false);
  });

  it("exposes note customization capabilities by plan", () => {
    const free = planFeaturesFor("free");
    const starter = planFeaturesFor("personal_premium");
    assert.equal(free.maxExpirySeconds, 3 * 24 * 60 * 60);
    assert.deepEqual(free.allowedReadCounts, [1]);
    assert.equal(free.recipientLinkDelivery, false);
    assert.equal(free.readerLanguage, false);
    assert.equal(free.delayedReveal, false);
    assert.equal(starter.maxExpirySeconds, 15 * 24 * 60 * 60);
    assert.deepEqual(starter.allowedReadCounts, [1, 2, 3]);
    assert.equal(starter.recipientLinkDelivery, true);
    assert.equal(starter.readerLanguage, true);
    assert.equal(starter.delayedReveal, true);
    assert.equal(free.receiptAcknowledgment, false);
    assert.equal(starter.receiptAcknowledgment, true);
  });

  it("allows open/destroyed email alerts on free and paid tiers", () => {
    assert.equal(hasOpenNotifications("free"), true);
    assert.equal(hasOpenNotifications("personal_premium"), true);
    assert.equal(hasOpenNotifications("business_premium"), true);
    assert.equal(hasPremiumFeatures("free"), false);
    assert.equal(hasPremiumFeatures("personal_premium"), true);
    assert.equal(hasPremiumFeatures("business_premium"), true);
  });
});
