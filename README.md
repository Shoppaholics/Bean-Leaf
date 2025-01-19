# Bean&Leaf

Bean&Leaf is a mobile application designed to enable users to track their coffee and tea consumptions, giving ratings for those consumptions and viewing them in an interactive interface.

## Prerequisites

Before you start, make sure you have the following installed:

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **NPM**: Comes with Node.js, used for managing project dependencies.
- **Git**: [Download and install Git](https://git-scm.com/)

## Environment Setup

1. **Clone the Repository**

   Clone the project repository to your local machine using Git:

   ```bash
   git clone https://github.com/your-username/Bean-Leaf.git
   cd Bean-Leaf
   ```

2. **Install Dependencies**

   Navigate to the project directory and install the required Node.js packages:

   ```bash
   npm install
   ```

3. **Create an environemnt file**
   Create a `.env` file in the root directory of the project and add the following environment variables:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Client ID, API keys and URL.

   You can get these details from the following websites:

   - **Supabase**: Sign up at [Supabase](https://supabase.com/dashboard/sign-in?returnTo=%2Fprojects) and go to the API section of your project to obtain your URL and Anon key.

## Running the project

- Enter the following command in a new terminal window:

```
npm expo start
```

- Open the project using expo go app or using a simulator.

## Features

### 1. Interactive map

- View coffee and tea locations that you and your friends visited on a map
- Location can be easily viewed from the map

### 2. Social network

- Add friends to share locations visited with all your friends

## Future Enhancements

### 1. Recommendations

- Show recommendations for users based on location and preferences

### 2. Add friend groups

- Allow forming friend groups so users can choose to share locations selectively

### 3. Leaderboard

- Rank users according to the number of likes they receive on the review published in the global database
