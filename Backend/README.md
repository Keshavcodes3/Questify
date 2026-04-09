# 🚀 Gamify Productivity Platform


## 🌟 1. What is Our Platform?  

Our platform is a **gamified productivity and habit-building system** that helps users manage tasks, develop daily habits, and participate in challenges.  
It combines the power of **habit tracking, task management, and social challenges** to keep users motivated and engaged.

💡 Users can:  
- Create and complete habits  
- Track streaks and earn XP/coins  
- Participate in challenges with others  
- View progress with analytics  

---

## 🎯 2. Why Did We Build This?  

The platform was created to **make productivity fun and engaging**. Many productivity apps are dry and fail to maintain user engagement.  

**Our goals:**  
- 🏆 Make productivity rewarding via gamification  
- 🔄 Encourage consistency with habit streaks  
- 👥 Build a community through challenges  
- 📊 Provide analytics for tracking growth  

---

## ⚡ 3. Features  

### ✅ Habit Management  
- Create daily or weekly habits  
- Track streaks and completion  
- Earn XP and coins  

### 📝 Task Management  
- Create, update, complete, or delete tasks  
- Set priority and due dates  
- Daily & weekly task stats  

### 🏆 Challenges  
- Join public or private challenges  
- Track progress & completion  
- Leaderboards to compare with participants  

### 🧩 User Profile & Rewards  
- Earn points, coins, and level up  
- Track performance metrics  
- Visual progress tracking  

### 📊 Analytics  
- Daily, weekly, and monthly stats  
- Habit streak monitoring  
- Challenge leaderboard stats  

---

## 🛠️ 4. API Documentation  

**Authentication:**  
All endpoints require JWT-based authentication via `Authorization` header.

### User Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/user/profile` | GET | Fetch user profile |
| `/user/update` | PATCH | Update user info |

### Habit Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/habit/create` | POST | Create a new habit |
| `/habit/complete/:id` | PATCH | Mark habit as complete |
| `/habit/:id` | DELETE | Delete a habit |

### Task Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/task/create` | POST | Create a new task |
| `/task/complete/:id` | PATCH | Complete or undo task |
| `/task/:id` | DELETE | Delete a task |

### Challenge Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/challenge/create` | POST | Create a challenge |
| `/challenge/join/:id` | POST | Join a challenge |
| `/challenge/:id` | GET | Get challenge details |
| `/challenge/complete/:id` | PATCH | Complete a challenge |

> Detailed request/response examples can be added in a separate Postman collection for better reference.  

---

## 🚀 5. Future Plans  

- 📱 Mobile apps for iOS & Android  
- 💬 Social features: messaging, friend lists, group challenges  
- 📈 Advanced analytics & habit insights  
- 🏅 Gamification enhancements: achievements, badges, seasonal events  
- 🤖 AI-powered habit suggestions & reminders  

---

## ❤️ Contributing  
We welcome contributions!  
1. Fork the repository  
2. Create a new branch  
3. Submit a pull request  

---

## 📄 License  
This project is licensed under the MIT License.  

---
