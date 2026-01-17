import Link from 'next/link';

import { ArrowRight, FileText, Layout, Layers, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Layout,
    title: 'Drag & Drop Builder',
    description:
      'Build PDF templates visually with our intuitive drag and drop interface. No coding required.',
  },
  {
    icon: Layers,
    title: 'Multi-Page Support',
    description:
      'Create complex documents with multiple pages, headers, footers, and customizable layouts.',
  },
  {
    icon: FileText,
    title: 'Rich Components',
    description:
      'Tables, lists, images, text blocks, and more. Everything you need for professional PDFs.',
  },
  {
    icon: Zap,
    title: 'Template Reusability',
    description: 'Save your designs as templates and generate PDFs on the fly with dynamic data.',
  },
];

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Create Beautiful PDF Templates
        </h1>
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg">
          Design professional PDF documents with our visual editor. Drag and drop components, add
          tables and charts, and generate dynamic PDFs from your templates.
        </p>
        <div className="mt-10 flex gap-4">
          <Button asChild size="lg">
            <Link href="/pdf-editor">
              Get Started
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="text-primary mb-2 size-10" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">Ready to Create Your First PDF?</h2>
          <p className="text-muted-foreground mt-4">
            Start building professional PDF templates in minutes. No design experience required.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/pdf-editor">
              Start Creating
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
