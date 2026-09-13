import { Sidebar } from "@/components/Sidebar";
import { RocketBackground } from "@/components/RocketBackground";
import { Section } from "@/components/Section";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { HowIWorkSection } from "@/components/portfolio/HowIWorkSection";
import { OverviewSection } from "@/components/portfolio/OverviewSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { StackSection } from "@/components/portfolio/StackSection";

export default function Home() {
  return (
    <div className="relative isolate lg:pl-72">
      <RocketBackground />
      <Sidebar />
      <main className="relative z-10 mx-auto max-w-3xl px-5 pt-10 sm:pt-20 pb-24 md:px-10 lg:pt-0">
        <Section id="overview" title="Overview">
          <OverviewSection />
        </Section>
        <Section id="experience" title="Experience">
          <ExperienceSection />
        </Section>
        <Section id="projects" title="Projects">
          <ProjectsSection />
        </Section>
        <Section id="how-i-work" title="Approach">
          <HowIWorkSection />
        </Section>
        <Section id="stack" title="Stack">
          <StackSection />
        </Section>
        <Section id="contact" title="Contact">
          <ContactSection />
        </Section>
      </main>
    </div>
  );
}
