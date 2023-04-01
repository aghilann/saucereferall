import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 3000;
import { mentors } from './routes/mentorsRouter.js';
import { Mentor } from './services/Mentor.js';
import { faker } from '@faker-js/faker';
// cors
app.use(cors({ origin: '*' }));

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api/mentors', mentors);

const jobTitles = [
  'Engineer',
  'Product',
  'Designer',
  'Manager',
  'Sales',
  'Marketing',
  'Finance',
  'Legal',
  'HR',
  'Operations',
  'Other',
];

app.get('/', (req, res) => {
  const params = {
    name: faker.name.fullName(),
    jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
    email: faker.internet.email(),
    company: faker.company.companyName(),
    avatar: faker.image.avatar(),
  };

  const mentor = new Mentor(params);
  mentor.save();
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
