import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Message } from '../models/Message';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/agritech_db';
    await mongoose.connect(mongoUri);

    console.log('🌱 Seeding database...\n');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await Message.deleteMany({});
    console.log('✅ Cleared existing users and messages');

    // Create test users
    const adminUser = new User({
      phone: '0912345678',
      password_hash: 'admin123456', // Will be hashed automatically
      fullName: 'Trần Văn A (Admin)',
      role: 'GOVERNMENT',
      region: 'Mekong Delta',
    });

    const farmer1 = new User({
      phone: '0909123456',
      password_hash: '12345678',
      fullName: 'Nguyễn Văn B (Nông dân)',
      role: 'FARMER',
      region: 'An Giang',
    });

    const farmer2 = new User({
      phone: '0987654321',
      password_hash: 'password123',
      fullName: 'Phạm Thị C (Nông dân)',
      role: 'FARMER',
      region: 'Cần Thơ',
    });

    await Promise.all([adminUser.save(), farmer1.save(), farmer2.save()]);

    console.log('✅ Created 3 users:');
    console.log(`   - ${adminUser.fullName} (${adminUser.phone})`);
    console.log(`   - ${farmer1.fullName} (${farmer1.phone})`);
    console.log(`   - ${farmer2.fullName} (${farmer2.phone})`);

    // Create sample messages
    const msg1 = new Message({
      senderId: adminUser._id,
      receiverId: farmer1._id,
      content: 'Chào bạn! Đây là tin nhắn từ Admin.',
      isRead: false,
    });

    const msg2 = new Message({
      senderId: farmer1._id,
      receiverId: adminUser._id,
      content: 'Chào admin! Tôi có vài câu hỏi về kỹ thuật canh tác.',
      isRead: false,
    });

    const msg3 = new Message({
      senderId: adminUser._id,
      receiverId: null, // Broadcast
      content: 'Thông báo chung: Hãy kiểm tra dữ liệu độ ẩm đất hôm nay!',
      isRead: false,
    });

    await Promise.all([msg1.save(), msg2.save(), msg3.save()]);

    console.log('✅ Created 3 sample messages');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   ADMIN:');
    console.log('     Phone: 0912345678');
    console.log('     Password: admin123456');
    console.log('   FARMER 1:');
    console.log('     Phone: 0909123456');
    console.log('     Password: 12345678');
    console.log('   FARMER 2:');
    console.log('     Phone: 0987654321');
    console.log('     Password: password123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDatabase();
