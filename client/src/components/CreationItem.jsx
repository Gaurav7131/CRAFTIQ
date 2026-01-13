import React, { useState } from 'react'
import Markdown from 'react-markdown'
import { ChevronDown, Clock, Image as ImageIcon, FileText } from 'lucide-react'

const CreationItem = ({ item }) => {

    const [expanded, setExpanded] = useState(false);

    // Helper to choose icon based on type
    const getIcon = () => {
        if (item.type === 'image') return <ImageIcon size={14} className="mr-1" />;
        return <FileText size={14} className="mr-1" />;
    };

    return (
        <div 
            onClick={() => setExpanded(!expanded)} 
            className={`
                group p-5 w-full bg-white border border-gray-100 rounded-2xl cursor-pointer
                transition-all duration-300 ease-in-out hover:shadow-lg hover:border-indigo-100 hover:-translate-y-1
                ${expanded ? 'ring-2 ring-indigo-50 border-indigo-100' : ''}
            `}
        >
            {/* --- HEADER SECTION --- */}
            <div className='flex justify-between items-center gap-4'>
                <div className="flex-1 min-w-0">
                    <h2 className='text-base font-semibold text-slate-800 truncate pr-4 group-hover:text-indigo-600 transition-colors'>
                        {item.prompt}
                    </h2>
                    
                    <div className='flex items-center gap-3 mt-1 text-xs text-slate-400'>
                        <span className='flex items-center bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100'>
                            {getIcon()} {item.type}
                        </span>
                        <span className='flex items-center'>
                            <Clock size={12} className="mr-1" />
                            {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Rotating Arrow & Badge */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                     {/* Type Badge */}
                     <span className={`
                        px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${item.type === 'image' 
                            ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                            : 'bg-blue-50 text-blue-600 border border-blue-100'}
                     `}>
                        {item.type}
                     </span>
                     
                     {/* Arrow Icon */}
                     <ChevronDown 
                        className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${expanded ? 'rotate-180 text-indigo-500' : ''}`} 
                     />
                </div>
            </div>

            {/* --- EXPANDABLE CONTENT SECTION --- */}
            <div 
                className={`
                    grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${expanded ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-dashed border-gray-100' : 'grid-rows-[0fr] opacity-0'}
                `}
            >
                <div className="overflow-hidden min-h-0">
                    {item.type === 'image' ? (
                        <div className="relative rounded-xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:shadow-md transition-shadow">
                            <img 
                                src={item.content} 
                                alt='Generated content' 
                                className='w-full h-auto object-cover max-h-96 transform transition-transform duration-700 hover:scale-105' 
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <div className='p-4 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100'>
                            <div className='prose prose-sm prose-indigo max-w-none'>
                                <Markdown>{item.content}</Markdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default CreationItem