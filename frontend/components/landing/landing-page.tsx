import { CTASection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { GermanyFocusSection } from "@/components/landing/germany-focus-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProductPreviewSection } from "@/components/landing/product-preview-section";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <LandingHeader />
      <main>
        <HeroSection />
        <ProductPreviewSection />
        <HowItWorksSection />
        <FeaturesSection />
        <GermanyFocusSection />
        <PricingSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
