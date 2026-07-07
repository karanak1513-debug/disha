import { collection, doc, getDocs, setDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export async function seedFirestoreDatabase() {
  try {
    const programsRef = collection(db, "programs");
    const snapshot = await getDocs(programsRef);
    if (!snapshot.empty) {
      console.log("Database already has programs. Skipping seed.");
      return;
    }

    console.log("Seeding Firestore with initial data...");
    const batch = writeBatch(db);

    // 1. Seed Programs
    const samplePrograms = [
      {
        id: "prog1",
        title: "Digital Literacy Campaign",
        description: "Teach basic computing, internet navigation, and smartphone usage to senior citizens and children in local communities.",
        category: "Education",
        location: "New Delhi, Delhi",
        skillsRequired: ["Basic Computing", "Patience", "Hindi/English Speaking"],
        volunteerLimit: 25,
        registeredCount: 14,
        hours: 15,
        xp: 200,
        deadline: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
        status: "Active",
        bannerURL: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
        createdAt: serverTimestamp()
      },
      {
        id: "prog2",
        title: "Swachh Bharat Clean Up & Recycling",
        description: "Join our weekly community cleanup drive focusing on waste sorting, recycling, and raising public hygiene awareness.",
        category: "Environment",
        location: "Mumbai, Maharashtra",
        skillsRequired: ["Physical fitness", "Teamwork", "Public Speaking"],
        volunteerLimit: 50,
        registeredCount: 38,
        hours: 6,
        xp: 100,
        deadline: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        status: "Active",
        bannerURL: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800",
        createdAt: serverTimestamp()
      },
      {
        id: "prog3",
        title: "Food Relief Distribution Drive",
        description: "Partnering with local food banks to packet and distribute fresh nutritious food to underprivileged families.",
        category: "Social Relief",
        location: "Bengaluru, Karnataka",
        skillsRequired: ["Organization", "Empathy"],
        volunteerLimit: 30,
        registeredCount: 29,
        hours: 8,
        xp: 150,
        deadline: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], // Closed
        status: "Completed",
        bannerURL: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
        createdAt: serverTimestamp()
      }
    ];

    samplePrograms.forEach((p) => {
      const docRef = doc(db, "programs", p.id);
      batch.set(docRef, p);
    });

    // 2. Seed Announcements
    const announcements = [
      {
        id: "ann1",
        title: "Welcome to DISHA for India platform!",
        content: "We are thrilled to launch the new Volunteer Management Dashboard. Here you can search for nearby volunteering opportunities, log your service hours, earn certificates, and join peer collaboration groups.",
        author: "Super Admin",
        category: "General",
        pinned: true,
        createdAt: serverTimestamp()
      },
      {
        id: "ann2",
        title: "Launch of Digital Literacy Certification Campaign",
        content: "Earn an exclusive DISHA certified educator badge by finishing 15 hours of classes under the Digital Literacy Campaign. Starts next Monday!",
        author: "Program Manager",
        category: "Event Update",
        pinned: false,
        createdAt: serverTimestamp()
      }
    ];

    announcements.forEach((a) => {
      const docRef = doc(db, "announcements", a.id);
      batch.set(docRef, a);
    });

    // 3. Seed Leaderboard entries
    const leaderboardEntries = [
      { id: "leader1", displayName: "Aarav Sharma", xp: 1250, hours: 42, rank: 1, avatar: "" },
      { id: "leader2", displayName: "Diya Patel", xp: 1100, hours: 38, rank: 2, avatar: "" },
      { id: "leader3", displayName: "Kabir Singh", xp: 950, hours: 30, rank: 3, avatar: "" },
      { id: "leader4", displayName: "Ananya Iyer", xp: 820, hours: 26, rank: 4, avatar: "" },
      { id: "leader5", displayName: "Rohan Mehta", xp: 750, hours: 22, rank: 5, avatar: "" }
    ];

    leaderboardEntries.forEach((l) => {
      const docRef = doc(db, "leaderboard", l.id);
      batch.set(docRef, l);
    });

    // 4. Seed Support Tickets
    const supportTickets = [
      {
        id: "tkt1",
        subject: "Certificate Signature Missing",
        message: "My certificate for the food distribution drive doesn't have a verified QR code link. Please check.",
        category: "Certificates",
        priority: "Medium",
        status: "Open",
        volunteerName: "Aarav Sharma",
        email: "aarav@disha.org",
        createdAt: serverTimestamp()
      }
    ];

    supportTickets.forEach((t) => {
      const docRef = doc(db, "supportTickets", t.id);
      batch.set(docRef, t);
    });

    await batch.commit();
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding Firestore database:", error);
  }
}
