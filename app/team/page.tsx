import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const metadata = {
  title: 'Our Team - ZE News',
  description: 'Meet the dedicated team behind ZE News, striving to bring accurate and timely news to you.',
  keywords: 'ZE News team, editorial team, reporters, journalists',
};

export default function TeamPage() {
  return (
    <section className="container mx-auto px-4 py-12 space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Our Team</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            ZE News is powered by a diverse and experienced team of journalists, editors, and technical experts who
            are passionate about delivering the news you can trust. Our collaborative spirit and dedication drive us
            to provide insightful, accurate, and impactful content each day.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => (
          <div key={member.name} className="text-center">
            <div className="space-y-4">
              <Avatar className="mx-auto w-32 h-32">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const teamMembers = [
  {
    name: 'Alice Johnson',
    title: 'Editor-in-Chief',
    initials: 'AJ',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b6dc4e26?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Bob Smith',
    title: 'Senior Reporter',
    initials: 'BS',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Cathy Brown',
    title: 'Fact-checker',
    initials: 'CB',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'David Lee',
    title: 'Multimedia Producer',
    initials: 'DL',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
];

