import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Careers - ZE News | Join Our Team',
  description: 'Explore exciting career opportunities at ZE News. Join our team of dedicated professionals committed to delivering accurate, reliable news and innovative journalism.',
  keywords: 'ZE News careers, journalism jobs, news media jobs, content writer jobs, marketing specialist, frontend developer, news industry careers',
  openGraph: {
    title: 'Careers - ZE News | Join Our Team',
    description: 'Explore exciting career opportunities at ZE News. Join our team of dedicated professionals committed to delivering accurate, reliable news.',
  },
};

const jobOpenings = [
  {
    title: 'Content Writer',
    description: 'We are seeking a highly motivated content writer with a passion for storytelling and a keen eye for detail.',
    qualifications: '2+ years of writing experience, excellent research skills, ability to meet deadlines.',
  },
  {
    title: 'Marketing Specialist',
    description: 'Join our marketing team to help increase brand awareness and drive engagement across various channels.',
    qualifications: '3+ years of marketing experience, digital marketing expertise, strong communication skills.',
  },
  {
    title: 'Frontend Developer',
    description: 'We are looking for a skilled frontend developer to build engaging user experiences.',
    qualifications: 'Proficiency in React.js, CSS, HTML, experience with responsive design.',
  },
];

export default function CareersPage() {
  return (
    <section className="container mx-auto px-4 py-12 space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Careers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="prose lg:prose-xl max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join our dynamic team at ZE News and be a part of a company that values innovation, integrity, and inclusivity. Explore our current job openings below:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {jobOpenings.map((job) => (
              <Card key={job.title} className="p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">{job.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {job.description}
                  </p>
                  <p className="text-sm font-medium">
                    Qualifications: {job.qualifications}
                  </p>
                  <Button className="mt-4">Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

