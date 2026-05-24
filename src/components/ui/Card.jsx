import { motion } from 'framer-motion';
import { cn } from '../../utils/classNames';

export const Card = ({ children, className, asMotion = false }) => {
  const Component = asMotion ? motion.div : 'div';
  return <Component className={cn('glass-panel rounded-lg p-4', className)}>{children}</Component>;
};
