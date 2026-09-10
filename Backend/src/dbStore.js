// Zero-dependency in-memory database store fallback when MongoDB binary cannot run due to disk space
class MemoryDB {
  constructor() {
    this.users = [];
    this.posts = [];
    this.sessions = [];
    this.directMessages = [];
  }

  // Direct Messages
  createDirectMessage({ senderId, recipientId, text, fileData }) {
    const msg = {
      _id: 'dm_' + Math.random().toString(36).substr(2, 9),
      sender: senderId,
      recipient: recipientId,
      text: text || '',
      fileData: fileData || null,
      read: false,
      createdAt: new Date(),
    };
    this.directMessages.push(msg);
    return msg;
  }

  getDirectMessages(user1Id, user2Id) {
    const u1 = user1Id.toString();
    const u2 = user2Id.toString();
    return this.directMessages.filter(
      (m) =>
        (m.sender.toString() === u1 && m.recipient.toString() === u2) ||
        (m.sender.toString() === u2 && m.recipient.toString() === u1)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  getConversationsForUser(userId) {
    const uid = userId.toString();
    const userMap = new Map();

    this.directMessages.forEach((m) => {
      const s = m.sender.toString();
      const r = m.recipient.toString();
      let partnerId = null;
      if (s === uid) partnerId = r;
      else if (r === uid) partnerId = s;

      if (partnerId) {
        const existing = userMap.get(partnerId);
        if (!existing || new Date(m.createdAt) > new Date(existing.lastMessage.createdAt)) {
          userMap.set(partnerId, {
            partner: this.findUserById(partnerId),
            lastMessage: m,
            unreadCount: (r === uid && !m.read) ? (existing?.unreadCount || 0) + 1 : (existing?.unreadCount || 0),
          });
        }
      }
    });

    return Array.from(userMap.values()).map((c) => ({
      partner: c.partner ? { _id: c.partner._id, name: c.partner.name, email: c.partner.email, avatar: c.partner.avatar } : null,
      lastMessage: c.lastMessage,
      unreadCount: c.unreadCount,
    }));
  }

  // Social Interactions (Likes, Comments, Bookmarks, Connections)
  toggleLikePost(postId, userId) {
    const post = this.findPostById(postId);
    if (!post) throw new Error('Post not found');
    if (!post.likes) post.likes = [];
    const uid = userId.toString();
    const idx = post.likes.findIndex((id) => id.toString() === uid);
    if (idx >= 0) {
      post.likes.splice(idx, 1);
    } else {
      post.likes.push(userId);
    }
    return post;
  }

  addCommentPost(postId, userId, text) {
    const post = this.findPostById(postId);
    if (!post) throw new Error('Post not found');
    if (!post.comments) post.comments = [];
    const user = this.findUserById(userId);
    const comment = {
      _id: 'cmt_' + Math.random().toString(36).substr(2, 9),
      user: userId,
      userName: user?.name || 'Member',
      text: text.trim(),
      createdAt: new Date(),
    };
    post.comments.push(comment);
    return post;
  }

  toggleBookmarkPost(postId, userId) {
    const post = this.findPostById(postId);
    if (!post) throw new Error('Post not found');
    if (!post.bookmarks) post.bookmarks = [];
    const uid = userId.toString();
    const idx = post.bookmarks.findIndex((id) => id.toString() === uid);
    if (idx >= 0) {
      post.bookmarks.splice(idx, 1);
    } else {
      post.bookmarks.push(userId);
    }
    return post;
  }

  toggleFollowUser(currentUserId, targetUserId) {
    const currentUser = this.findUserById(currentUserId);
    const targetUser = this.findUserById(targetUserId);
    if (!currentUser || !targetUser) throw new Error('User not found');
    if (!currentUser.connections) currentUser.connections = [];
    const tid = targetUserId.toString();
    const idx = currentUser.connections.findIndex((id) => id.toString() === tid);
    let isFollowing = false;
    if (idx >= 0) {
      currentUser.connections.splice(idx, 1);
      isFollowing = false;
    } else {
      currentUser.connections.push(targetUserId);
      isFollowing = true;
    }
    return { currentUser, isFollowing };
  }

  // Users
  createUser(data) {
    const user = {
      _id: 'user_' + Math.random().toString(36).substr(2, 9),
      bio: '',
      avatar: '',
      skillsOffered: [],
      skillsWanted: [],
      rating: 4.8,
      ratingCount: 5,
      sessionsCompleted: 0,
      connections: [],
      createdAt: new Date(),
      ...data,
    };
    this.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find((u) => u._id.toString() === id.toString());
  }

  updateUser(id, updates) {
    const u = this.findUserById(id);
    if (u) {
      Object.assign(u, updates);
    }
    return u;
  }

  getUsers(query = {}) {
    let result = [...this.users];
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.skillsOffered?.some((s) => s.toLowerCase().includes(q))
      );
    }
    return result;
  }

  // Posts
  createPost(authorId, data) {
    const author = this.findUserById(authorId);
    const post = {
      _id: 'post_' + Math.random().toString(36).substr(2, 9),
      author,
      title: data.title,
      skillOffered: data.skillOffered,
      skillWanted: data.skillWanted,
      description: data.description || '',
      status: 'open',
      proposals: [],
      createdAt: new Date(),
    };
    this.posts.push(post);
    return post;
  }

  getPosts(query = {}) {
    let result = [...this.posts];
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.skillOffered?.toLowerCase().includes(q) ||
          p.skillWanted?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  findPostById(id) {
    return this.posts.find((p) => p._id.toString() === id.toString());
  }

  addProposal(postId, userId, message) {
    const post = this.findPostById(postId);
    if (!post) throw new Error('Post not found');
    const user = this.findUserById(userId);
    const proposal = {
      _id: 'prop_' + Math.random().toString(36).substr(2, 9),
      user,
      message,
      status: 'pending',
      createdAt: new Date(),
    };
    post.proposals.push(proposal);
    return post;
  }

  respondProposal(postId, proposalId, action) {
    const post = this.findPostById(postId);
    if (!post) throw new Error('Post not found');
    const proposal = post.proposals.find((p) => p._id.toString() === proposalId.toString());
    if (!proposal) throw new Error('Proposal not found');

    if (action === 'accept') {
      proposal.status = 'accepted';
      post.status = 'matched';
      const session = this.createSession({
        requester: post.author,
        helper: proposal.user,
        skill: `${post.skillWanted} ↔ ${post.skillOffered}`,
        description: `Matched exchange from post: ${post.title}`,
        status: 'accepted',
      });
      return { post, session };
    } else {
      proposal.status = 'declined';
      return { post };
    }
  }

  // Sessions
  createSession(data) {
    const session = {
      _id: 'sess_' + Math.random().toString(36).substr(2, 9),
      requester: data.requester,
      helper: data.helper,
      skill: data.skill,
      description: data.description || '',
      status: data.status || 'pending',
      scheduledAt: data.scheduledAt || null,
      meetingStatus: data.meetingStatus || 'none',
      meetingRequestedBy: data.meetingRequestedBy || null,
      requesterRating: data.requesterRating || null,
      requesterReview: data.requesterReview || '',
      helperRating: data.helperRating || null,
      helperReview: data.helperReview || '',
      messages: [],

      createdAt: new Date(),
    };
    this.sessions.push(session);
    return session;
  }


  getSessionsForUser(userId) {
    return this.sessions.filter(
      (s) =>
        s.requester?._id?.toString() === userId.toString() ||
        s.helper?._id?.toString() === userId.toString()
    );
  }

  addSessionMessage(sessionId, senderId, text) {
    const session = this.sessions.find((s) => s._id.toString() === sessionId.toString());
    if (!session) throw new Error('Session not found');
    const msg = {
      _id: 'msg_' + Math.random().toString(36).substr(2, 9),
      sender: senderId,
      text,
      createdAt: new Date(),
    };
    session.messages.push(msg);
    return msg;
  }
}

export const memoryDB = new MemoryDB();
