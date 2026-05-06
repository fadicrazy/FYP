import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Patient, PatientDocument } from '../patients/patient.schema';
import { Consultation, ConsultationDocument } from '../consultations/consultation.schema';
import { Prescription, PrescriptionDocument } from '../prescriptions/prescription.schema';
import { Delivery, DeliveryDocument } from '../deliveries/delivery.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Consultation.name) private consultationModel: Model<ConsultationDocument>,
    @InjectModel(Prescription.name) private prescriptionModel: Model<PrescriptionDocument>,
    @InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>,
  ) {}

  async getStats() {
    const [totalUsers, totalPatients, totalConsultations, totalPrescriptions, totalDeliveries, usersByRole, consultationsByStatus, deliveriesByStatus, recentUsers] =
      await Promise.all([
        this.userModel.countDocuments(),
        this.patientModel.countDocuments(),
        this.consultationModel.countDocuments(),
        this.prescriptionModel.countDocuments(),
        this.deliveryModel.countDocuments(),
        this.userModel.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
        this.consultationModel.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        this.deliveryModel.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        this.userModel.find().select('-password').sort({ createdAt: -1 }).limit(5),
      ]);

    return {
      totalUsers,
      totalPatients,
      totalConsultations,
      totalPrescriptions,
      totalDeliveries,
      usersByRole,
      consultationsByStatus,
      deliveriesByStatus,
      recentUsers,
    };
  }

  async getAllUsers(role?: string) {
    const filter: any = {};
    if (role) filter.role = role;
    return this.userModel.find(filter).select('-password').sort({ createdAt: -1 });
  }

  async approveUser(userId: string) {
    return this.userModel.findByIdAndUpdate(userId, { isApproved: true }, { new: true }).select('-password');
  }

  async deactivateUser(userId: string) {
    return this.userModel.findByIdAndUpdate(userId, { isActive: false }, { new: true }).select('-password');
  }

  async deleteUser(userId: string) {
    return this.userModel.findByIdAndDelete(userId);
  }

  async getActivityLog() {
    // Get recent consultations as activity log
    const recentConsultations = await this.consultationModel
      .find()
      .populate([
        { path: 'patientId', populate: { path: 'userId', select: 'name' } },
        { path: 'doctorId', select: 'name' },
        { path: 'nurseId', select: 'name' },
      ])
      .sort({ createdAt: -1 })
      .limit(20);

    return recentConsultations;
  }

  async getMonthlyStats() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyConsultations = await this.consultationModel.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyRegistrations = await this.userModel.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return { monthlyConsultations, monthlyRegistrations };
  }
}
