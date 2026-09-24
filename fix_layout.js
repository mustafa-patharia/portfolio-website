const fs = require('fs');
const path = require('path');
const dir = '/Users/mustafapatharia/My Projects/Portfolio/components/case-studies';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/<section className="grid grid-cols-1 gap-12 lg:grid-cols-2">/g, '<section className="flex flex-col gap-16">');
  content = content.replace(/<div className="rounded-3xl border border-stroke bg-surface p-8 md:p-10">/g, '<div>');
  content = content.replace(/<h3 className="mb-6 font-display text-2xl italic text-text-primary">/g, '<h2 className="mb-6 font-display text-3xl italic text-text-primary md:text-4xl">');
  content = content.replace(/<\/h3>/g, '</h2>');
  content = content.replace(/<p className="leading-relaxed text-muted">/g, '<p className="leading-relaxed text-muted md:text-lg">');
  
  fs.writeFileSync(filePath, content);
}
console.log("Fixed layouts in all case studies.");
