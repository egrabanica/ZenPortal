import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingUp, Users, Globe } from 'lucide-react';

export const metadata = {
  title: 'About Us - ZE News',
  description: 'Learn about ZE News, our mission to deliver accurate and unbiased journalism, and meet our dedicated team of reporters and editors.',
  keywords: 'about ZE News, journalism, news team, fact-checking, editorial team',
};

export default function AboutPage() {
  return (
    <section className="container mx-auto px-4 py-12 space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold">
            About Us
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="prose lg:prose-xl max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome to <strong>ZE News</strong>, your trusted source for real-time news and comprehensive fact-checking. 
              Founded on the principles of journalistic integrity and transparency, we are committed to delivering 
              accurate, unbiased, and timely news that keeps you informed about the world around you.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In an era of information overload and misinformation, ZE News stands as a beacon of truth. Our dedicated 
              team of experienced journalists, editors, and fact-checkers work around the clock to bring you stories 
              that matter, ensuring that every piece of content we publish meets the highest standards of accuracy 
              and reliability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fact-Checked</h3>
              <p className="text-sm text-muted-foreground">Every story undergoes rigorous fact-checking to ensure accuracy</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real-Time</h3>
              <p className="text-sm text-muted-foreground">Breaking news and trending stories delivered as they happen</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Global Coverage</h3>
              <p className="text-sm text-muted-foreground">From local communities to international affairs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Meet the Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Meet the passionate individuals behind ZE News. Our diverse team brings together decades of experience 
            in journalism, digital media, and fact-checking to deliver the news you can trust.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="group">
                <Card className="text-center p-6 h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-center">
                      <Avatar className="w-24 h-24 ring-4 ring-background shadow-lg">
                        <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                        <AvatarFallback className="text-xl bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{member.name}</h3>
                      <Badge variant="secondary" className="text-xs">{member.title}</Badge>
                      <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

const teamMembers = [
  {
    name: 'Alice Johnson',
    title: 'Editor-in-Chief',
    initials: 'AJ',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b6dc4e26?w=150&h=150&fit=crop&crop=face',
    description: 'Alice leads our editorial team with over 10 years of experience in journalism and digital media.',
  },
  {
    name: 'Bob Smith',
    title: 'Senior Reporter',
    initials: 'BS',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    description: 'Bob covers international news with a focus on human rights and global policies.',
  },
  {
    name: 'Cathy Brown',
    title: 'Fact-checker',
    initials: 'CB',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    description: 'Cathy is dedicated to debunking misinformation and verifying facts with precision.',
  },
  {
    name: 'David Lee',
    title: 'Multimedia Producer',
    initials: 'DL',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    description: 'David creates compelling visual content and manages our video production pipeline.',
  },
];

