**Chat Application**

**Summary:**

This chat application, built using Angular and local storage as the database, supports three distinct user roles: Super Admin, Group Admin, and User. Each role has specific capabilities:

- Super Admin:
  - Can create groups and users.
  - Can add members to groups and promote them to either Group Admin or Super Admin.
- Group Admin:
  - Can create channels within their assigned groups.
  - Can manage group members by adding or removing them.
- User:
  - Can browse groups and show interest in channels.
  - If a Group Admin approves their request, they are allowed to participate in group channel chats.

The application features role-based permissions, group and channel management, and a request-approval system for users to join channels.

**Github:**

I use GitHub periodically to manage the version control of the chat application. By committing updates regularly, I can track the differences between each version, ensuring that I have a clear history of changes and can easily identify and revert any issues. This allows for consistent improvements and a streamlined development process.

Github link: https://github.com/dulyanaaa/chat

**Datastructures and models:**

In this application, I primarily used arrays and objects for structuring and managing data. Arrays are used for handling lists of items like users and groups, while objects are used to store more complex, structured data such as user details, group properties, and channels.


Five models used in the application are:

- User
- Group
- Channel
- Interest
- Chat 


**User Model:**

The User model is a class used to represent the structure of a user in the chat application. It defines the necessary properties and their respective types, ensuring consistency in how user data is stored and managed across the application.

Properties:

- id (number): A unique identifier for each user.
- username (string): The username chosen by the user, used for identification within the system.
- email (string): The user's email address, typically used for communication or login purposes.
- password (string): A hashed version of the user's password for authentication.
- roles (string[]): An array of strings representing the user's roles, such as 'Super Admin', 'Group Admin', or 'User', defining the permissions they have in the application.
- groups (number[]): An array of group IDs, indicating which groups the user belongs to.

**Group Model:**

The Group model defines the structure for groups in the chat application. This model ensures that each group is represented consistently, allowing the application to manage group data such as channels, admins, and members.

Properties:

- id (number): A unique identifier for each group.
- name (string): The name of the group, used to identify and display the group in the application.
- channels (number[]): An array of channel IDs associated with the group. These IDs reference the channels that belong to this group.
- adminIds (number[]): An array of user IDs that represent the admins of the group. Group Admins manage the group and its members.
- members (string[]): An array of user ids representing the members of the group. These are the users who have access to the group.

This model ensures proper organization of groups by keeping track of channels, admins, and members, which is crucial for managing permissions and group-related activities in the chat application.

**Channel Model:**

The Channel model defines the structure for channels within groups in the chat application. Channels represent specific communication areas where members of a group can interact. This model ensures that channels are consistently managed, including the members who have access to them.

Properties:

- id (number): A unique identifier for each channel.
- name (string): The name of the channel, used for display and identification within the group.
- groupId (number): The ID of the group to which the channel belongs, ensuring that each channel is associated with the correct group.
- members (number[] | null): An array of user IDs representing the members who have access to this channel. If there are no members assigned, it can be null.

**Interest Model:**

The Interest model defines the structure for representing a user's interest in a channel within the chat application. It is used to manage and track requests from users to join specific channels.

Properties:

- id (number): A unique identifier for each interest record.
- channelId (number): The ID of the channel in which the user has expressed interest. This links the request to the relevant channel.
- userId (number): The ID of the user who has shown interest in joining the channel. This identifies the user making the request.



**Chat Model:**

The Chat model defines the structure for individual messages exchanged within channels in the chat application. It captures all relevant details associated with a chat message, ensuring that messages are organized and easily retrievable.

Properties:

- messageId (number): A unique identifier for each chat message, allowing for efficient retrieval and management of messages.
- userId (number): The ID of the user who sent the message, linking the message to the corresponding user in the application.
- username (string): The username of the sender, providing a human-readable identifier for the message's author.
- channelId (number): The ID of the channel where the message was sent, ensuring the message is associated with the correct context.
- content (string): The actual text content of the chat message, representing what the user has communicated.
- timestamp (Date): The date and time when the message was sent, allowing for chronological sorting and display of messages.

This model is crucial for managing chat interactions within channels, enabling features such as message retrieval, display, and user identification.


**Services:**

**Channel Service**

The ChannelService is responsible for managing channels within the application. It handles operations related to channel creation, retrieval, updating, and deletion. Key functionalities include:

- Channel Management:
  - getChannels(): Retrieves all channels from local storage.
  - getChannelById(id): Finds and returns a specific channel by its ID.
  - getChannelsByGroupId(groupId): Fetches channels that belong to a specific group.
  - addChannel(newChannel): Adds a new channel to local storage.
  - updateChannel(updatedChannel): Updates an existing channel in local storage.
  - deleteChannel(channelId): Removes a channel by its ID.
- Member Management:
  - updateChannelMembers(channelId, members): Updates the list of members in a specific channel.

The ChannelService uses a local storage service to persist channel data, ensuring that channels remain available across sessions.

**Chat Service**

The ChatService manages chat messages exchanged within channels. It provides methods for adding, retrieving, updating, and deleting chat messages. Key functionalities include:

- Chat Management:
  - getChats(): Retrieves all chat messages from local storage.
  - getChatsByChannelId(channelId): Fetches all chat messages related to a specific channel.
  - getChatsByUserId(userId): Retrieves chat messages sent by a specific user.
  - addChat(newChat): Adds a new chat message and generates a unique message ID.
  - updateChat(updatedChat): Updates an existing chat message.
  - deleteChat(messageId): Deletes a chat message by its ID.

The ChatService ensures that all chat interactions are stored in local storage, allowing for persistent access to chat history even after the application is closed.

**Group Service:**

The GroupService is responsible for managing groups within the chat application. It provides various methods for group creation, retrieval, updating, and deletion, ensuring that group-related data is handled effectively and stored persistently.

**Key Functionalities:**

Group Management:

getGroups(): Retrieves all groups from local storage, returning them as an array of Group objects.

grouptCount(): Returns the total number of groups currently stored, useful for monitoring the application's state.

Adding and Updating Groups:

addGroup(group: Group): Adds a new group to the list of groups and updates local storage to ensure persistence.

updateGroups(groups: Group[]): Updates the entire groups array in local storage, allowing for bulk updates.

Member Management:

addMembersToGroup(selectedGroupId: number, selectedUsers: number[]): Locates a group by its ID and prepares to add specified users to that group. (Currently, this method only logs the found group.)

Deletion:

deleteGroup(id: number): Removes a group by its ID, ensuring that the change is reflected in local storage.

Admin Group Retrieval:

getGroupsByAdminId(adminId: number): Filters groups to return only those for which the specified user is an admin. This is particularly useful for displaying relevant groups to admin users.

Data Persistence

The GroupService utilizes a local storage service to persist group data, ensuring that groups remain accessible even after the application is closed or refreshed. By keeping the groups array in memory and syncing changes with local storage, the service provides an efficient way to manage group data while maintaining application performance.

**Interest Service**

The InterestService is responsible for managing user interests in specific channels within the chat application. It provides methods for adding, retrieving, and removing interests, while ensuring that the data is stored persistently.

**Key Functionalities:**

- **Interest Management:**
  - addInterest(userId: number, channelId: number): Creates a new interest for a user in a specific channel. It generates a unique ID for the new interest, adds it to the interests array, and saves the updated interests to local storage.
- **Retrieving Interests:**
  - getInterestsByUserId(userId: number): Returns an array of interests associated with a specific user, filtering the interests based on the user ID.
  - getAllInterests(): Retrieves all interests from the service.
- **Enriched Data Retrieval:**
  - getAllInterestsWithUsernameChannelName(): Returns a list of interests enriched with additional information, such as the username of the user associated with each interest and the name of the channel. It combines data from the UserService and ChannelService, ensuring a comprehensive view of interests.
- **Removing Interests:**
  - removeInterest(interestId: number): Deletes an interest based on its ID from the interests array and updates the local storage accordingly.

Data Persistence

The InterestService initializes by loading existing interests from local storage when the service is instantiated. It keeps the interests in memory and syncs any changes back to local storage, providing a seamless experience across sessions.

- **loadInterests(): Loads interests from local storage at initialization.**
- **saveInterests(): Saves the current interests to local storage after any modification.**

Dependency Management

The service utilizes dependencies such as UserService and ChannelService to retrieve user and channel information. This modular approach enhances the maintainability of the application, allowing different components to work together effectively.

**Local Storage Service**

The localStorageService is a utility service designed to simplify interactions with the browser's local storage. It provides methods for getting, setting, and removing items, enabling persistent storage of data across user sessions in a clean and efficient manner.

**Key Functionalities:**

- **Retrieving Data:**
  - getItem(key: string): Retrieves an item from local storage using the specified key. It parses the JSON string stored in local storage and returns the corresponding JavaScript object. If the item does not exist, it returns null.
- **Storing Data:**
  - setItem(key: string, value: any): Stores a JavaScript object in local storage under the specified key. The object is converted to a JSON string before storage, ensuring that complex data types can be saved.
- **Removing Data:**
  - removeItem(key: string): Deletes the item associated with the specified key from local storage. This method is useful for clearing data when it is no longer needed.

Data Management

The localStorageService abstracts away the complexities of working directly with the browser's local storage API, providing a straightforward interface for other services and components in the application. By using this service, developers can easily manage data persistence without worrying about the underlying implementation details.

Usage

This service can be injected into any Angular component or service where persistent storage is required. It facilitates efficient data management, enabling the application to maintain state and user preferences across sessions.

**User Service**

The UserService is a critical service in your Angular application that manages user-related operations, such as authentication, user data retrieval, and updates. It interacts with the localStorageService to persist user data across sessions.

**Key Functionalities:**

- **User Management:**
  - getUsers(): Retrieves the list of all users stored in local storage. This method returns an array of User objects.
  - getUserById(userId: number): Finds and returns a specific user by their ID. If the user does not exist, it returns undefined.
- **User Authentication:**
  - authenticate(username: string, password: string): Checks the provided credentials against the stored users and returns the matching user object if found; otherwise, it returns null.
- **Current User Handling:**
  - getCurrentUser(): Retrieves the currently logged-in user from local storage. If no user is logged in, it returns null.
  - setCurrentUser(user: User): Saves the current user object to local storage, effectively logging the user in.
- **User Creation and Update:**
  - addUser(user: User): Adds a new user to the local storage and updates the users array.
  - updateUser(updatedUser: User): Updates an existing user’s information in local storage. It searches for the user by ID and replaces the old data with the updated data.
- **User Deletion:**
  - deleteUser(userId: number): Removes a user from the list and updates local storage accordingly.
- **Filtering Users:**
  - getAllUsersExceptSuperAdmins(): Returns a list of all users except those with the 'Super Admin' role. This is useful for displaying user options to non-admin roles.
- **Group Management:**
  - removeGroupFromUser(userId: number, groupId: number): Removes a specified group ID from a user's groups and updates the user in local storage.

Usage

The UserService is designed to be injected into components and other services where user-related operations are needed. By encapsulating user management logic, it promotes code reusability and separation of concerns, allowing for easier maintenance and testing.

**Routing:**

This routing module defines the navigation paths for your application, organizing routes based on different user roles: Super Admin, Group Admin, and User. It uses Angular's RouterModule to manage navigation between components.

**Key Features:**

1. **Route Structure:**
   1. The application starts with a configuration path that directs to the ConfigComponent. Get request of /config will create super user with username super and password 123.
   1. The home path serves as a wrapper for authentication-related components (LoginComponent, RegisterComponent).
1. **Super Admin Routes:**
   1. The routes under the superadmin path use the LayoutComponent, serving as a container for sub-routes like UsersComponent, GroupsComponent, ChannelsComponent, and ChatComponent.
   1. The empty path within this section defaults to the UsersComponent. So by default all users are shown when superadmin logs in.

1. **Group Admin Routes:**
   1. Similarly structured, the groupadmin routes utilize the AdminLayout, encompassing components like AdminGroup, AdminChannel, InterestsComponent, and AdminChatComponent.
1. **User Routes:**
   1. The user path utilizes the UserLayout, providing routes for user-specific functionalities such as UserGroups, ChatComponent, and DeleteComponent.

**System Interactions:** 

Whenever data is submitted through form, the angular component having that form calls the specific service like for registering user user service will be called which will use localstorage service to get data from localstorage and pass to user service for further process. 

UsersComponent in superadmin has property showAddUserForm which is by default false. So add user form is hidden when user clicks add user button this property is set to true and form appears on the view. 

When a component is rendered, it calls specific service like group component on init calls group service to get all groups group service uses localstorage service to get item with name groups. When groups are returned in init group, they are saved on property groups. And they are rendered in table. When a group is updated like its name or members then again group service is provided with new group data , group service finds the group and populate it with new data and pass it to localstorage service so it is updated to localstorage too. Then group component fetches groups data again so it will have updated data and it is assigned to property of class GroupComponent And angular renders on the frontend. So user groups table data is updated automatically. Angular does it behind the scenes because of two way data binding. 

So each component communicates with its service and on init gets data and saves data to a property on a class. That data is rendered in a table using ngFor directive of angular.

Similar thing happens in users component, channels component, interests component and chat component.

