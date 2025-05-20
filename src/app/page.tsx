import {
  LandingPageAppBar,
  LandingPageFAQ,
  LandingPageFooter,
  LandingPageHighlights,
  LandingPageTestimonials,
  LandinPageHero,
} from "@/components";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

export default function LandingPage() {
  return (
    <Box>
      {/* <ToggleMode /> */}
      <LandingPageAppBar />
      <LandinPageHero />
      <Box sx={{ bgcolor: "background.default" }}>
        <LandingPageTestimonials />
        <Divider />
        <LandingPageHighlights />
        <Divider />
        <LandingPageFAQ />
        <Divider />
        <LandingPageFooter />
      </Box>
    </Box>
  );
}
