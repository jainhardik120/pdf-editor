'use client';

import Link from 'next/link';

import { ArrowRight, FileText, Layout, Layers, Zap, Check, BarChart3, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Layout,
    title: 'Drag & Drop Builder',
    description:
      'Intuitive visual editor that requires zero coding. Build professional PDF templates in minutes with our simple drag-and-drop interface.',
    benefits: ['No coding required', 'Real-time preview', 'Intuitive controls'],
  },
  {
    icon: Layers,
    title: 'Multi-Page Support',
    description:
      'Create complex, multi-page documents with full control over layouts. Add custom headers, footers, and page breaks effortlessly.',
    benefits: ['Unlimited pages', 'Custom layouts', 'Page management'],
  },
  {
    icon: FileText,
    title: 'Rich Components',
    description:
      'Access a comprehensive library of components including tables, lists, images, text blocks, and more for professional documents.',
    benefits: ['30+ components', 'Full customization', 'Advanced styling'],
  },
  {
    icon: Zap,
    title: 'Template Reusability',
    description:
      'Save your designs as reusable templates and generate PDFs on demand with dynamic data integration.',
    benefits: ['Save templates', 'Dynamic data', 'Instant generation'],
  },
];

const benefits = [
  { title: 'Save Time', value: '80%', description: 'Faster than traditional PDF design' },
  { title: 'Zero Learning Curve', value: '100%', description: 'Intuitive for all skill levels' },
  { title: 'Professional Quality', value: '∞', description: 'Enterprise-grade output' },
];

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      {/* Hero Section - Premium and Bold */}
      <section className="from-background via-background to-secondary/20 relative w-full overflow-hidden bg-gradient-to-br">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="bg-primary/10 absolute top-20 right-10 h-72 w-72 rounded-full blur-3xl" />
          <div className="bg-accent/10 absolute bottom-20 left-10 h-72 w-72 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-32 text-center">
          <div className="animate-fadeInUp bg-secondary/60 border-border mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2">
            <span className="bg-accent h-2 w-2 animate-pulse rounded-full" />
            <span className="text-foreground text-sm font-medium">
              Now Available: Template Library
            </span>
          </div>

          <h1 className="animate-fadeInUp mb-6 text-5xl leading-tight font-bold tracking-tight text-balance sm:text-7xl">
            Create Beautiful PDF Templates
            <span className="from-primary to-accent mt-2 block bg-gradient-to-r bg-clip-text text-transparent">
              Without the Complexity
            </span>
          </h1>

          <p className="text-muted-foreground animate-fadeInUp mb-8 max-w-2xl text-lg text-balance sm:text-xl">
            Design professional PDF documents with our intuitive visual editor. Perfect for
            invoices, reports, certificates, and more. Drag, drop, and generate—no coding required.
          </p>

          <div className="animate-fadeInUp mb-16 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              className="group gap-2 transition-all duration-300 hover:shadow-lg"
              size="lg"
            >
              <Link href="/pdf-editor">
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              className="hover:bg-secondary gap-2 bg-transparent transition-colors duration-300"
              size="lg"
              variant="outline"
            >
              <Link href="#features">
                Explore Features
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Hero Visual - Placeholder for screenshot */}
          <div className="animate-scaleIn mx-auto w-full max-w-4xl">
            <div className="from-card to-card/50 border-border relative overflow-hidden rounded-lg border bg-gradient-to-b shadow-2xl">
              <img
                alt="PDF Editor Interface"
                className="h-auto w-full"
                src="/pdf-editor-interface-with-drag-and-drop-components.jpg"
              />
              <div className="from-background/20 absolute inset-0 bg-gradient-to-t to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-secondary/30 w-full px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="group text-center">
                <div className="text-primary mb-2 text-5xl font-bold transition-transform duration-300 group-hover:scale-110">
                  {benefit.value}
                </div>
                <h3 className="text-foreground mb-1 text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Detailed Cards */}
      <section className="bg-background w-full px-4 py-24" id="features">
        <div className="mx-auto max-w-6xl">
          <div className="animate-fadeInUp mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold sm:text-5xl">Powerful Features</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Everything you need to create professional PDF templates, from design to deployment.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {features.map((feature, idx) => (
              <Card
                key={feature.title}
                className="group border-border hover:border-primary/50 animate-fadeInUp cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-3 transition-colors duration-300">
                      <feature.icon className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary text-xl transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                  <ul className="space-y-2">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm">
                        <Check className="text-accent h-4 w-4 flex-shrink-0" />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="bg-secondary/20 w-full px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 grid items-center gap-12 md:grid-cols-2">
            <div className="animate-slideInLeft">
              <h2 className="mb-4 text-4xl font-bold">Professional Results</h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Generate enterprise-grade PDFs that look polished and professional. Our advanced
                rendering engine ensures perfect output every time.
              </p>
              <ul className="space-y-3">
                {[
                  'High-resolution output',
                  'Perfect formatting',
                  'Batch generation',
                  'API integration',
                ].map((item) => (
                  <li key={item} className="text-foreground flex items-center gap-3">
                    <div className="bg-accent h-2 w-2 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="animate-scaleIn">
              <img
                alt="PDF Output Examples"
                className="border-border w-full rounded-lg border shadow-lg"
                src="/professional-pdf-documents-output-showcase.jpg"
              />
            </div>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="animate-scaleIn order-2 md:order-1">
              <img
                alt="Template Features"
                className="border-border w-full rounded-lg border shadow-lg"
                src="/template-reusability-and-dynamic-data-features.jpg"
              />
            </div>
            <div className="animate-slideInLeft order-1 md:order-2">
              <h2 className="mb-4 text-4xl font-bold">Reusable Templates</h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Build once, use infinitely. Save your designs as templates and generate PDFs with
                dynamic data in seconds.
              </p>
              <ul className="space-y-3">
                {[
                  'Template versioning',
                  'Dynamic variables',
                  'Quick duplication',
                  'Share with team',
                ].map((item) => (
                  <li key={item} className="text-foreground flex items-center gap-3">
                    <div className="bg-accent h-2 w-2 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-background w-full px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Perfect For</h2>
            <p className="text-muted-foreground text-lg">
              Trusted by businesses and professionals across industries
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              { title: 'Invoices', icon: '📄', desc: 'Generate branded invoices instantly' },
              { title: 'Reports', icon: '📊', desc: 'Create data-driven reports' },
              { title: 'Certificates', icon: '🏆', desc: 'Issue professional certificates' },
              { title: 'Tickets', icon: '🎫', desc: 'Generate event or support tickets' },
            ].map((useCase, idx) => (
              <div
                key={useCase.title}
                className="border-border bg-card hover:border-primary/50 group animate-fadeInUp cursor-pointer rounded-lg border p-6 text-center transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="mb-3 text-4xl transition-transform duration-300 group-hover:scale-110">
                  {useCase.icon}
                </div>
                <h3 className="text-foreground mb-2 font-semibold">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Bold Call to Action */}
      <section className="from-primary/10 to-accent/10 border-border w-full border-t border-b bg-gradient-to-r px-4 py-24">
        <div className="animate-fadeInUp mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold sm:text-5xl">Ready to Get Started?</h2>
          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl">
            Join thousands of professionals creating beautiful PDFs. No credit card required. Start
            building today.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="group gap-2 transition-all duration-300 hover:shadow-lg"
              size="lg"
            >
              <Link href="/pdf-editor">
                Start Creating Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              className="hover:bg-secondary gap-2 bg-transparent transition-colors duration-300"
              size="lg"
              variant="outline"
            >
              <Link href="/templates">Browse Templates</Link>
            </Button>
          </div>

          <p className="text-muted-foreground mt-8 text-sm">
            ✨ Free forever plan available • No credit card required • Full feature access
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-secondary/20 w-full px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid gap-8 text-center md:grid-cols-3">
            <div>
              <Clock className="text-primary mx-auto mb-3 h-8 w-8" />
              <h3 className="mb-2 font-semibold">Quick Setup</h3>
              <p className="text-muted-foreground text-sm">Start creating in seconds</p>
            </div>
            <div>
              <BarChart3 className="text-accent mx-auto mb-3 h-8 w-8" />
              <h3 className="mb-2 font-semibold">Scale Instantly</h3>
              <p className="text-muted-foreground text-sm">Generate thousands of PDFs</p>
            </div>
            <div>
              <FileText className="text-primary mx-auto mb-3 h-8 w-8" />
              <h3 className="mb-2 font-semibold">Professional Output</h3>
              <p className="text-muted-foreground text-sm">Enterprise-grade quality</p>
            </div>
          </div>

          <div className="border-border text-muted-foreground border-t pt-8 text-center">
            <p>© 2026 PDF Template Builder. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
