import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

// Adaptive Neon Badges for both modes
const getCategoryColor = (category) => {
  switch (category) {
    case "Book":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20";
    case "Guides":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
    case "Course":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20";
    case "Technical":
      return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20";
    case "Behavioral":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
    default:
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/20";
  }
}

export default function ResourceCard({
  id,
  title,
  description,
  category,
  image,
  link,
  featured = false,
}) {
  const cardContent = (
    <motion.div
      whileHover={{ y: -10 }}
      /* LIGHT: bg-white + shadow-xl + border-slate-200
         DARK: bg-white/5 + dark shadow + border-white/5
      */
      className={`relative group bg-white dark:bg-[#0f172a]/40 backdrop-blur-xl 
                  border border-slate-200 dark:border-white/5 rounded-[2.5rem] 
                  overflow-hidden transition-all duration-500 
                  shadow-[0_15px_35px_rgba(148,163,184,0.1)] dark:shadow-none
                  hover:border-blue-500 dark:hover:border-cyan-500/50 
                  hover:shadow-[0_25px_50px_rgba(37,99,235,0.15)] dark:hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] 
                  ${featured ? "h-full" : ""}`}
    >
      {/* Visual Header */}
      <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          crossOrigin="anonymous"
        />
        {/* Dark overlay only appears in Dark mode for better depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#020617] via-transparent to-transparent opacity-40 dark:opacity-80 transition-opacity"></div>
      </div>

      <div className="p-8 relative z-10">
        <div className="mb-4">
          <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
          {title}
        </h3>

        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2 font-medium transition-colors">
          {description}
        </p>

        {/* Dynamic Action Link */}
        <div className="flex items-center space-x-3 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-[0.2em] transition-colors">
          <span>{featured ? "View Masterclass" : "Explore Module"}</span>
          <div className="w-9 h-9 rounded-full bg-blue-600/10 dark:bg-cyan-500/10 border border-blue-600/20 dark:border-cyan-500/20 flex items-center justify-center group-hover:bg-blue-600 dark:group-hover:bg-blue-600 group-hover:translate-x-2 transition-all duration-300">
            <FaArrowRight size={12} className="text-blue-600 dark:text-white group-hover:text-white" />
          </div>
        </div>
      </div>
      
      {/* Decorative Glow Corner (Dynamic opacity) */}
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-blue-500/5 dark:bg-cyan-500/5 blur-3xl group-hover:bg-blue-500/20 dark:group-hover:bg-cyan-500/20 transition-all"></div>
    </motion.div>
  )

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full outline-none">
         {cardContent}
      </a>
    )
  }

  return cardContent
}