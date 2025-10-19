import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/userMiddleware";

const prisma = new PrismaClient();

// Get dashboard statistics for the authenticated user
export async function getDashboardStats(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    // Get total reports by this user
    const totalReports = await prisma.report.count({
      where: { userId },
    });

    // Get open reports by this user
    const openReports = await prisma.report.count({
      where: { userId, status: "PENDING" },
    });

    // Get resolved reports by this user
    const resolvedReports = await prisma.report.count({
      where: { userId, status: "RESOLVED" },
    });

    // Get total votes received by this user's reports
    const userReports = await prisma.report.findMany({
      where: { userId },
      select: { id: true },
    });

    const reportIds = userReports.map((r) => r.id);
    const totalVotes = await prisma.vote.count({
      where: { reportId: { in: reportIds } },
    });

    // Get total comments received by this user's reports
    const totalComments = await prisma.comment.count({
      where: { reportId: { in: reportIds } },
    });

    // Calculate average resolution time (mock data for now)
    const avgResolutionTime = "2.4h";

    // Get reports this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const reportsThisMonth = await prisma.report.count({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
    });

    const stats = {
      totalReports,
      openReports,
      resolvedReports,
      totalVotes,
      totalComments,
      avgResolutionTime,
      reportsThisMonth,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
}

// Get recent activities for the authenticated user
export async function getDashboardActivities(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    // Get recent reports by this user
    const recentReports = await prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        category: true,
      },
    });

    // Get recent votes by this user
    const recentVotes = await prisma.vote.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        report: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    // Get recent comments by this user
    const recentComments = await prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        report: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    // Combine and sort all activities
    const activities = [
      ...recentReports.map((report) => ({
        id: `report_${report.id}`,
        type: "report_created" as const,
        title: `Created report: ${report.title}`,
        description: `Status: ${report.status}`,
        timestamp: report.createdAt.toISOString(),
        metadata: {
          reportId: report.id,
          status: report.status,
          category: report.category,
        },
      })),
      ...recentVotes.map((vote) => ({
        id: `vote_${vote.id}`,
        type: "vote_cast" as const,
        title: `Voted on report: ${vote.report.title}`,
        description: `Vote: ${vote.voteType}`,
        timestamp: vote.createdAt.toISOString(),
        metadata: {
          reportId: vote.report.id,
          voteType: vote.voteType,
        },
      })),
      ...recentComments.map((comment) => ({
        id: `comment_${comment.id}`,
        type: "comment_added" as const,
        title: `Commented on report: ${comment.report.title}`,
        description:
          comment.text.substring(0, 100) +
          (comment.text.length > 100 ? "..." : ""),
        timestamp: comment.createdAt.toISOString(),
        metadata: {
          reportId: comment.report.id,
        },
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 20);

    res.json(activities);
  } catch (error) {
    console.error("Error fetching dashboard activities:", error);
    res.status(500).json({ message: "Failed to fetch dashboard activities" });
  }
}

// Get user profile information
export async function getUserProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        phone: true,
        address: true,
        bio: true,
        theme: true,
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: true,
        profileVisibility: true,
        showEmail: true,
        showPhone: true,
        allowMessages: true,
        isAdmin: true,
        verified: true,
        dateJoined: true,
        _count: {
          select: {
            reports: true,
            comments: true,
            votes: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Get community engagement stats for this user
    const userReports = await prisma.report.findMany({
      where: { userId },
      select: { id: true },
    });

    const reportIds = userReports.map((r) => r.id);
    const totalVotes = await prisma.vote.count({
      where: { reportId: { in: reportIds } },
    });

    const totalComments = await prisma.comment.count({
      where: { reportId: { in: reportIds } },
    });

    // Get user's reputation/points
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
    });

    // Calculate level based on points (simple logic)
    const points = userPoints?.points || 0;
    const level = Math.floor(points / 100) + 1;
    const progress = points % 100;

    const profile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      preferences: {
        theme: user.theme,
        emailNotifications: user.emailNotifications,
        pushNotifications: user.pushNotifications,
        weeklyDigest: user.weeklyDigest,
      },
      privacy: {
        profileVisibility: user.profileVisibility,
        showEmail: user.showEmail,
        showPhone: user.showPhone,
        allowMessages: user.allowMessages,
      },
      role: user.isAdmin ? "admin" : "user",
      stats: {
        reportsCreated: user._count.reports,
        reportsResolved: 0, // Would need to implement this logic
        votesCast: user._count.votes, // Votes the user has made
        commentsMade: user._count.comments, // Comments the user has written
        reputation: points,
        communityEngagement: {
          totalVotesReceived: totalVotes,
          totalCommentsReceived: totalComments,
          helpfulVotesReceived: totalVotes, // Assuming all votes are helpful for now
        },
      },
      level: {
        current: level,
        max: 10,
        progress: progress,
      },
    };

    res.json(profile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
}

// Update user preferences
export async function updateUserPreferences(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { theme, emailNotifications, pushNotifications, weeklyDigest } =
      req.body;

    // Update user preferences
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        theme: theme || "light",
        emailNotifications:
          emailNotifications !== undefined ? emailNotifications : true,
        pushNotifications:
          pushNotifications !== undefined ? pushNotifications : true,
        weeklyDigest: weeklyDigest !== undefined ? weeklyDigest : false,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        theme: true,
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: true,
      },
    });

    res.json({
      message: "Preferences updated successfully",
      preferences: {
        theme: updatedUser.theme,
        emailNotifications: updatedUser.emailNotifications,
        pushNotifications: updatedUser.pushNotifications,
        weeklyDigest: updatedUser.weeklyDigest,
      },
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    res.status(500).json({ message: "Failed to update preferences" });
  }
}

// Update user privacy settings
export async function updateUserPrivacy(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { profileVisibility, showEmail, showPhone, allowMessages } = req.body;

    // Validate profileVisibility
    const validVisibilityOptions = ["public", "friends", "private"];
    if (
      profileVisibility &&
      !validVisibilityOptions.includes(profileVisibility)
    ) {
      res.status(400).json({
        message:
          "Invalid profile visibility option. Must be 'public', 'friends', or 'private'",
      });
      return;
    }

    // Update user privacy settings
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profileVisibility: profileVisibility || "public",
        showEmail: showEmail !== undefined ? showEmail : false,
        showPhone: showPhone !== undefined ? showPhone : false,
        allowMessages: allowMessages !== undefined ? allowMessages : true,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        profileVisibility: true,
        showEmail: true,
        showPhone: true,
        allowMessages: true,
      },
    });

    res.json({
      message: "Privacy settings updated successfully",
      privacy: {
        profileVisibility: updatedUser.profileVisibility,
        showEmail: updatedUser.showEmail,
        showPhone: updatedUser.showPhone,
        allowMessages: updatedUser.allowMessages,
      },
    });
  } catch (error) {
    console.error("Error updating user privacy settings:", error);
    res.status(500).json({ message: "Failed to update privacy settings" });
  }
}

// Update user profile information
export async function updateUserProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { firstName, lastName, username, phone, address, bio } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !username) {
      res.status(400).json({
        message: "First name, last name, and username are required",
      });
      return;
    }

    // Check if username is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username,
        id: { not: userId },
      },
    });

    if (existingUser) {
      res.status(400).json({
        message: "Username is already taken",
      });
      return;
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        username,
        phone: phone || null,
        address: address || null,
        bio: bio || null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        isAdmin: true,
        verified: true,
        dateJoined: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
}

// Get user's reports
export async function getUserReports(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(reports);
  } catch (error) {
    console.error("Error fetching user reports:", error);
    res.status(500).json({ message: "Failed to fetch user reports" });
  }
}

// Get reports the user has voted on
export async function getUserVotes(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const votes = await prisma.vote.findMany({
      where: { userId },
      include: {
        report: {
          include: {
            _count: {
              select: {
                votes: true,
                comments: true,
              },
            },
            author: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const reports = votes.map((vote) => vote.report);
    res.json(reports);
  } catch (error) {
    console.error("Error fetching user votes:", error);
    res.status(500).json({ message: "Failed to fetch user votes" });
  }
}
