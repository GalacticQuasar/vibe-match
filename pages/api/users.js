import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('spotify-user-storage');

  switch (req.method) {
    case 'GET':
      const { id } = req.query;

      try {
        let user;
        if (!id) {
            user = await db.collection('users').find({}).toArray();
        } else {
            user = await db.collection('users').findOne({ id: id });
        }

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error:error.message });
      }

      break;

    case 'POST':
      try {
        const newUser = req.body;

        const result = await db.collection('users').insertOne(newUser);
        res.status(201).json({ message: "success" }); // Return the created user
      } catch (error) {
        res.status(500).json({ message: 'Error adding user', error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
