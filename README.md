````markdown
# Sharents: Celebrate Every Milestone 🎉👶

Sharents is the ultimate app for guardians to share and track their baby's precious moments with family and friends. Our platform brings loved ones together, no matter the distance, to witness and celebrate a child's growth from their early years and beyond.

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/sharents/sharents-app.git

# Navigate to the project directory
cd sharents-app

# Fire up the app
docker-compose build
docker-compose up
```
````

Now view the app at http://localhost:3000/

![Img](/images/sharents.jpg)

## 🛠 Tech Stack

- **Backend**: FastAPI 🚀
- **Frontend**: React ⚛️
- **Database**: MongoDB 🍃
- **DevOps**: Docker 🐳

## 🧰 Development Tools

We're committed to clean, efficient code. Our toolkit includes:

- **Black**: For consistent Python formatting
- **djlint**: Keeping our HTML templates tidy
- **flake8**: Linting for Python perfection
- **Poetry**: Dependency management made easy

## 🌟 Key Features

- **Milestone Tracking**: Never miss a moment, from first steps to first words
- **Photo & Video Sharing**: Upload and share high-quality media effortlessly
- **Family Circles**: Create private groups for sharing with select loved ones
- **Timeline View**: Chronological display of your child's journey
- **Notifications**: Keep everyone in the loop with real-time updates

## Design

Sharets is made up of a React frontend and four backend microservices which interact with one another

- **Users**
- **Child**
- **Milestones and Media**
- **Events**

![Img](/images/excalii.png) (placeholder image for clarissa's excalidraw)

## Users Microservice

The Users microservice is the part of Sharents that handles the creation of a guardian and members and the invitation of members through a secure, tokenized email link. It also handles user login authentification and authorization.

### Models

1. Guardian Model
2. Member Model
3. Invite Model

### Model Relationships

- **Guardian Model**: Represents a guardian of a child
- **Member Model**: Respresents a member, who is invited by a guardian to view a particular child. It inclues an "invited_by" key, which is the id of the guardian who invited them. This is a one to many relationship: A guardian can have many members that he/she invited, but a member can only have one guardian who invite them.
- **Invite Model**: Represents an invite, which includes a specific child, their guardian and the member that is invited. A separate invite is created for each child that a member can view.

### Integration with Child Microservice

A separate invite is created in the database for each child, member and guardian that invited the member. Invites specify which children a member can view. In order to retrieve all children for a specific member to view, all invitations with a member's id on it are retrieved, and then the children on those invites are then retrieved from the Child microservice.

## Child Microservice

The Child microservice handles the creation, updating, deletion and retrieval of a child, or all children of a guardian or member. Each child is related to a specific guardian and the invites specificy which child is related to which members.

### Models

1. Child Model

### Model Relationships

- **Child Model**: Represents a child

### Integration with Milestones and Media and Events microservices

Children can have associated milestones, media, events and wishlists and these are managed by their respective services. Each milestone, media or event will have a child key, creating a one to many relationship. For example, a child can have many milestones, but a milestone can only have one child. The same is true for media and events. When a specific child is viewed, all their milestones and media are fetched from the Milestones and Media service and their events are fetched from the Events microservice.

## Milestones and Media Microservice

The Milestones and Media microservice handles the creation, updating, deletion and retrieval of all milestones and media associated with a child. Media includes both photos and videos, while milestones are text descriptions of a child's latest activity. Both milestones and media have specific dates attached to them and are also categorized into one of the following categories:

- growth
- food
- health
- speech
- physical
- cognitive
- other

The Milestones and Media also handles the creation, updaing deletion and retrieval of comments associated with each milestone or media.

### Models

1. Milestone Model
2. Media Model
3. Comment Model

### Model Relationships

- **Milestone Model**: Represents a milestone that has a child key, creating a one to many relationship. For example a child can have many milestones, but a milestone can only have one child
- **Media Model**: Represents a media with type "photo" or "video". Each one has a child key, creating a one to many relationship. For example a child can have many photos, but a photo can only have one child
- **Comment Model**: Represents a comment by a member or guardian on a milestone or a media. It has either a milestone or a media key creating a one to many relationship. For example a particular milestone can have many comments, but a comment can only have one milestone.

## Events Microservice

The Events microservice handles the creation, updating, deletion and retrieval of events associated with children. It also handles the creation, updating, deletion and retrieval of a wishlist and wishlist items associated with events.

### Models

1. Event Model
2. Wishlist Model
3. Wishlist Item Model

### Model Relationships

- **Event Model**: Represents a event that has a child key, creating a one to many relationship. For example a child can have many events, but a event can only have one child
- **Wishlist Model**: Represents a wishlist that has an event key, creating a one to many relationship. A wishlist has just one event, but it is possible for events to have more than one wishlist (although, in practice, an event will only have one wishlist).
- **Wisthlist Item Model**: Represents a wishlist item on a particular wishlist. Each item has a wishlist key creating a one to many relationship. For example a particular wishlist can have many items, but a item can belong to only one wishlist

## 👀 Meet the Dream Team

- **Clarissa Lopez**
- **Caleb Saunders**
- **Linda Woo**

## 🤝 Contributing

We welcome contributions! Check out our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🐛 Found a Bug?

Issues and pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## 📜 License

Sharents is open-source software licensed under the [MIT license](LICENSE.md).

## 💖 Support Sharents

Love Sharents? Give us a star on Gitlab and spread the word!

---

Built with ❤️ by Next Chapter / Hack Reactor Cohort Attendees Summer 2024.
