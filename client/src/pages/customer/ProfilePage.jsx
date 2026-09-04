import { useState, useEffect } from 'react';
import { User, Lock, MapPin, CheckCircle2, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services';
import { formatDate } from '../../utils/formatters';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [savingPassword, setSavingPassword] = useState(false);
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        country: user.country || 'India',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authService.updateProfile(profileForm);
      updateUser(res.data.data.user);
      toast.success('Profile details updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    if (passForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setSavingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
      {/* Profile Header banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black shadow-inner">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black">{user?.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 border border-indigo-400/40 text-indigo-200">
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-indigo-200">{user?.email}</p>
          <p className="text-[11px] text-zinc-400 flex items-center justify-center sm:justify-start gap-1 pt-1">
            <Calendar className="w-3.5 h-3.5" />
            Member since {formatDate(user?.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Personal Details Form */}
        <div className="md:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Personal Information
            </h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
                className="input-base text-xs mt-1"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Contact Phone
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="input-base text-xs mt-1"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Primary Shipping Address
              </label>
              <textarea
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                rows={2}
                placeholder="Street address, building, floor"
                className="input-base text-xs mt-1 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">City</label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  placeholder="City"
                  className="input-base text-xs mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">State</label>
                <input
                  type="text"
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  placeholder="State"
                  className="input-base text-xs mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Pincode</label>
                <input
                  type="text"
                  value={profileForm.pincode}
                  onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                  placeholder="Pincode"
                  className="input-base text-xs mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Country</label>
                <input
                  type="text"
                  value={profileForm.country}
                  onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                  className="input-base text-xs mt-1"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="btn-primary text-xs w-full py-3.5 rounded-2xl font-bold mt-2"
            >
              {savingProfile ? 'Saving...' : 'Save Profile Details'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Account Security
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Current Password
              </label>
              <input
                type="password"
                value={passForm.currentPassword}
                onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                required
                className="input-base text-xs mt-1"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                New Password
              </label>
              <input
                type="password"
                value={passForm.newPassword}
                onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                required
                className="input-base text-xs mt-1"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passForm.confirmPassword}
                onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                required
                className="input-base text-xs mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="btn-secondary text-xs w-full py-3.5 rounded-2xl font-bold mt-2"
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
