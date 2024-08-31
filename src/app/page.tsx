import {
  LandingPageAppBar,
  LandingPageFAQ,
  LandingPageFooter,
  LandingPageHighlights,
  LandingPageLogoCollection,
  LandingPagePricing,
  LandingPageTestimonials,
  LandinPageFeatures,
  LandinPageHero,
  ToggleMode,
} from "@/components";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

export default function LandingPage() {
  return (
    <Box>
      <LandingPageAppBar />
      <LandinPageHero />
      <Box sx={{ bgcolor: "background.default" }}>
        <LandingPageLogoCollection />
        <LandinPageFeatures />
        <Divider />
        <LandingPageTestimonials />
        <Divider />
        <LandingPageHighlights />
        <Divider />
        <LandingPagePricing />
        <Divider />
        <LandingPageFAQ />
        <Divider />
        <LandingPageFooter />
      </Box>
      <ToggleMode />
    </Box>
  );
}
