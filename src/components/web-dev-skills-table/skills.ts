export interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  detail?: string;
  sort?: number;
}

export const skills: Skill[] = [
  // langs
  { name: 'Javascript', category: 'Language', level: '10+ years', sort: 1 },
  { name: 'Typescript', category: 'Language', level: '2+ years', sort: 1 },
  { name: 'T-SQL', category: 'Language', level: '10+ years', sort: 1 },

  // backend
  { name: 'Node.JS', category: 'Backend', level: '10+ years', sort: 2 },
  { name: 'Express', category: 'Backend', level: '10+ years', sort: 2 },
  { name: 'MVC.net', category: 'Backend', level: '~3 years' },
  { name: 'Razor', category: 'Backend', level: '~3 years' },
  { name: 'WebForms', category: 'Backend', level: '~10 years' },

  // frontend
  {
    name: 'VueJS',
    detail: 'Options, Composition',
    category: 'Frontend',
    level: '7+ years'
  },
  { name: 'Bootstrap', category: 'Frontend', level: '10+ years', sort: 2 },
  { name: 'Less/SCSS', category: 'Frontend', level: '10+ years', sort: 2 },
  { name: 'TailwindCSS', category: 'Frontend', level: '~2 years' },
  { name: 'Vuetify', category: 'Frontend', level: '~3 years' },
  { name: 'JQuery', category: 'Frontend', level: '10+ years', sort: 2 },
  { name: 'TanStack Query', category: 'Frontend', level: '~2 years' },

  // db
  { name: 'MongoDB', category: 'Database', level: '10+ years', sort: 2 },
  { name: 'PostgresSQL', category: 'Database', level: '7+ years' },
  { name: 'MSSQL', category: 'Database', level: '~10 years' },
  { name: 'Drizzle', category: 'Database', level: '~1 year' },
  { name: 'MySQL/MariaDB', category: 'Database', level: '~1 year' },
  { name: 'Mongoose', category: 'Database', level: '10+ years', sort: 2 },
  { name: 'NHibernate', category: 'Database', level: '~7 years' },
  { name: 'Redis', category: 'Database', level: '~7 years' },
  { name: 'Entity Framework', category: 'Database', level: '~5 years' },

  // tools
  { name: 'Bash' , category: 'Tools', level: '10+ years', sort: 2},
  { name: 'Webpack' , category: 'Tools', level: '~7 years'},
  { name: 'Sublime Text' , category: 'Tools', level: '~7 years'},
  { name: 'Git', category: 'Tools', level: '10+ years', sort: 2},
  { name: 'Heroku', category: 'Tools', level: '~7 years'},
  {
    name: 'AWS',
    category: 'Tools', level: '10+ years', sort: 2,
    detail: (
      ['S3', 'Cloudfront', 'Lambdas', 'RDS/Aurora', 'EC2', 'ELB', 'AppRunner']
        .sort().join(', ')
    ),
  },
  { name: 'Docker' , category: 'Tools', level: '10+ years', sort: 2},
  { name: 'Visual Studio Code' , category: 'Tools', level: '7+ years'},
  { name: 'Cursor' , category: 'Tools', level: '6+ months'},
  { name: 'Sublime Text', category: 'Tools', level: '10+ years', sort: 2},
  { name: 'PostMan' , category: 'Tools', level: '7+ years'},
  { name: 'Yaak' , category: 'Tools', level: '7+ years'},
  { name: 'Stack Overflow' , category: 'Tools', level: '10+ years', sort: 2},
  { name: 'Data Grip' , category: 'Tools', level: '7+ years'},

  // learning
  { name: 'React', category: 'Frontend', level: '*' },
  { name: 'Astro' , category: 'Frontend/Backend', level: '*', sort: 100 },
  { name: 'Next.js' , category: 'Frontend/Backend', level: '*', sort: 100 },
  { name: 'Cursor' , category: 'Tools', level: '*', sort: 100},
  { name: 'GraphQL', category: 'Database', level: '*', sort: 100 },
  { name: 'Server Islands', category: 'Influences', level: '*', sort: 100 },

  // concepts
  { name: 'SOLID' , category: 'Influences', level: '-', sort: 101 },
  { name: 'DRY/WET' , category: 'Influences', level: '-', sort: 101 },
  { name: 'OWASP', category: 'Influences', level: '-', sort: 101 },
  { name: 'Agile' , category: 'Influences', level: '-', sort: 101 },
  { name: 'RESTful' , category: 'Influences', level: '-', sort: 101 },
  { name: 'tRPC' , category: 'Influences', level: '-', sort: 101 },
  { name: 'Pragmatic Programmer' , category: 'Influences', level: '-', sort: 101 },
].map((skill, i) => ({
  ...skill,
  id: i.toString(),
})).sort((a, b) => {
  if ((a.sort || 5) === (b.sort || 5)) {
    if (a.category === b.category) {
      return a.name.localeCompare(b.name);
    }

    return a.category.localeCompare(b.category);
  }

  return (a.sort || 5) - (b.sort || 5);
});
