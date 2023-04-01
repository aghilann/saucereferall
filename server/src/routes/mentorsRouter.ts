// Setup a
// Setup a new router
import { Router } from 'express';
import { Mentor } from '../services/Mentor.js';
import { faker } from '@faker-js/faker';
const router = Router();

const data = {
  data: [
    {
      avatar:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      name: 'Robert Wolfkisser',
      job: 'Engineer',
      email: 'rob_wolf@gmail.com',
      phone: '+44 (452) 886 09 12',
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      name: 'Jill Jailbreaker',
      job: 'Engineer',
      email: 'jj@breaker.com',
      phone: '+44 (934) 777 12 76',
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      name: 'Henry Silkeater',
      job: 'Designer',
      email: 'henry@silkeater.io',
      phone: '+44 (901) 384 88 34',
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      name: 'Bill Horsefighter',
      job: 'Designer',
      email: 'bhorsefighter@gmail.com',
      phone: '+44 (667) 341 45 22',
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
      name: 'Jeremy Footviewer',
      job: 'Manager',
      email: 'jeremy@foot.dev',
      phone: '+44 (881) 245 65 65',
    },
  ],
};

router.get('/', async (req, res) => {
  const { jobTitle, company } = req.query;
  if (!jobTitle) return res.json(await Mentor.getAllMentors());
  const mentors = await Mentor.getMentorsByTitle(jobTitle);
  res.json(mentors);
});

router.post('/', (req, res) => {
  const { name, jobTitle, email, company } = req.body;
  const mentor = new Mentor({
    name,
    jobTitle,
    email,
    company,
    avatar: faker.image.avatar(),
  });
  mentor.save();
  res.json({ message: 'Mentor created' });
});

export { router as mentors };
