 false,
      isSupabaseUser: false,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('attributeai_user', JSON.stringify(newUser));
    setUser(newUser);

    return {
      success: true,
      user: newUser,
      message: 'Account created successfully (demo mode)'
    };
  };

  const signInWithLocalStorage = (email) => {
    const storedUser = localStorage.getItem('attributeai_user');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.email === email) {
          setUser(userData);
          return {
            success: true,
            user: userData
          };
        }
      } catch (error) {
        console.error('Parse stored user error:', error);
      }
    }

    // Create new demo user if no stored user found
    const demoUser = createDemoUser();
    demoUser.email = email;
    
    localStorage.setItem('attributeai_user', JSON.stringify(demoUser));
    setUser(demoUser);

    return {
      success: true,
      user: demoUser,
      message: 'Signed in with demo account'
    };
  };

  // Subscription management
  const upgradeSubscription = async (tier) => {
    try {
      if (isSupabaseConfigured() && user?.isSupabaseUser) {
        const quotaMap = {
          'free': 1000,
          'professional': 10000,
          'enterprise': 100000,
          'agency': 500000
        };

        const { error } = await supabase
          .from('users')
          .update({
            subscription_tier: tier,
            monthly_keyword_quota: quotaMap[tier] || 1000,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) {
          throw error;
        }
      }

      // Update local state
      const updatedUser = {
        ...user,
        subscriptionTier: tier,
        monthlyQuota: tier === 'professional' ? 10000 : tier === 'enterprise' ? 100000 : 1000
      };
      
      setUser(updatedUser);
      localStorage.setItem('attributeai_user', JSON.stringify(updatedUser));

      return { success: true };

    } catch (error) {
      console.error('Subscription upgrade error:', error);
      return {
        success: false,
        error: error.message || 'Subscription upgrade failed'
      };
    }
  };

  // Usage tracking
  const incrementKeywordUsage = async (count = 1) => {
    try {
      if (isSupabaseConfigured() && user?.isSupabaseUser) {
        await supabase.rpc('increment_keyword_usage', {
          user_uuid: user.id,
          keyword_count: count
        });
      }

      // Update local state
      const updatedUser = {
        ...user,
        keywordsUsed: (user.keywordsUsed || 0) + count
      };
      
      setUser(updatedUser);
      localStorage.setItem('attributeai_user', JSON.stringify(updatedUser));

    } catch (error) {
      console.error('Usage increment error:', error);
      // Continue with local update even if database update fails
      const updatedUser = {
        ...user,
        keywordsUsed: (user.keywordsUsed || 0) + count
      };
      
      setUser(updatedUser);
      localStorage.setItem('attributeai_user', JSON.stringify(updatedUser));
    }
  };

  const checkQuotaStatus = () => {
    if (!user) return { hasQuota: false, remaining: 0 };

    const used = user.keywordsUsed || 0;
    const quota = user.monthlyQuota || 1000;
    const remaining = Math.max(0, quota - used);

    return {
      hasQuota: remaining > 0,
      remaining,
      used,
      quota,
      percentage: Math.min(100, (used / quota) * 100),
      tier: user.subscriptionTier || 'free'
    };
  };

  // Helper methods
  const isAuthenticated = () => {
    return !!user;
  };

  const isPremiumUser = () => {
    return user?.subscriptionTier !== 'free';
  };

  const getSupabaseConnection = () => {
    return {
      isConfigured: isSupabaseConfigured(),
      hasSession: !!session,
      user: session?.user || null
    };
  };

  const value = {
    // State
    user,
    session,
    loading,
    
    // Authentication methods
    signUp,
    signIn,
    signOut,
    updateUser,
    resetPassword,
    
    // Subscription management
    upgradeSubscription,
    
    // Usage tracking
    incrementKeywordUsage,
    checkQuotaStatus,
    
    // Helper methods
    isAuthenticated,
    isPremiumUser,
    getSupabaseConnection,
    
    // Configuration
    isSupabaseConfigured: isSupabaseConfigured()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;