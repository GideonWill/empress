import { Link } from "wouter";
import { motion } from "framer-motion";

interface CategoryCircleProps {
  name: string;
  image: string;
  href?: string;
}

export function CategoryCircle({ name, image, href }: CategoryCircleProps) {
  const content = (
    <motion.div 
      className="flex flex-col items-center group cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <span className="text-sm font-medium text-gray-900 group-hover:text-black text-center">{name}</span>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

