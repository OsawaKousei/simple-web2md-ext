import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  status?: string;
  statusColor?: 'orange' | 'green' | 'blue';
}

export default function ContentCard({
  icon,
  title,
  description,
  features,
  status,
  statusColor = 'orange'
}: ContentCardProps) {
  const statusStyles = {
    orange: 'bg-orange-100 text-orange-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800'
  };

  return (
    <Card className="bg-gray-50 border-gray-200 h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <p className="text-gray-600 mb-4 leading-relaxed">
          {description}
        </p>
        <div className="space-y-2 text-sm">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {feature}
            </div>
          ))}
        </div>
      </CardContent>
      {status && (
        <CardFooter className="border-t border-gray-200 pt-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusStyles[statusColor]}`}>
            {status}
          </span>
        </CardFooter>
      )}
    </Card>
  );
}
