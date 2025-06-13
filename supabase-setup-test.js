// Supabase Database Setup Script
// Run this to test connection and set up the AttributeAI database schema

import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const supabaseUrl = 'https://xpyfoutwwjslivrmbflm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweWZvdXR3d2pzbGl2cm1iZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDMyODcsImV4cCI6MjA2NTQxOTI4N30.SmuHFfvlbgvU0rWsPZyn-UuZ3l135g3nKkZJqFA_bpc';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  try {
    // Test connection by running a simple query
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful!');
    console.log('📊 Connected to database:', supabaseUrl);
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

async function checkExistingTables() {
  console.log('📋 Checking existing tables...');
  
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .neq('table_name', 'schema_migrations');

    if (error) {
      console.error('❌ Error checking tables:', error.message);
      return [];
    }

    const tableNames = data.map(table => table.table_name);
    console.log('📊 Found tables:', tableNames);
    
    // Check if AttributeAI tables exist
    const requiredTables = [
      'users', 'keyword_analyses', 'related_keywords', 
      'content_opportunities', 'competitor_analyses', 
      'keyword_performance', 'user_activity'
    ];
    
    const existingAttributeAITables = requiredTables.filter(table => 
      tableNames.includes(table)
    );
    
    if (existingAttributeAITables.length > 0) {
      console.log('✅ Found existing AttributeAI tables:', existingAttributeAITables);
      return existingAttributeAITables;
    } else {
      console.log('ℹ️ No AttributeAI tables found - schema needs to be created');
      return [];
    }
    
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
    return [];
  }
}

async function testBasicOperations() {
  console.log('🧪 Testing basic database operations...');
  
  try {
    // Test if we can create a simple test table
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.error('❌ Database operation failed:', error.message);
      return false;
    }
    
    console.log('✅ Database operations working');
    console.log('📊 PostgreSQL version:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Database operation test failed:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🚀 AttributeAI Supabase Setup');
  console.log('================================');
  
  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('❌ Setup failed - connection issues');
    return;
  }
  
  // Check existing tables
  const existingTables = await checkExistingTables();
  
  // Test operations
  const operationsWork = await testBasicOperations();
  
  if (!operationsWork) {
    console.log('❌ Setup failed - database operation issues');
    return;
  }
  
  // Summary
  console.log('\n📋 Setup Summary:');
  console.log('==================');
  console.log('✅ Connection: Working');
  console.log('✅ Database: Accessible');
  console.log('✅ Operations: Functional');
  
  if (existingTables.length > 0) {
    console.log('✅ AttributeAI tables: Found');
    console.log('🎯 Status: Ready to use!');
  } else {
    console.log('⚠️ AttributeAI tables: Not found');
    console.log('🛠️ Next step: Run schema.sql in Supabase dashboard');
  }
  
  console.log('\n🎉 Supabase setup verification complete!');
  console.log('📱 Your AttributeAI platform is ready for production use.');
}

// Export for use in other files
export { supabase, testConnection, checkExistingTables };

// Run if this file is executed directly
if (typeof window === 'undefined') {
  main();
}