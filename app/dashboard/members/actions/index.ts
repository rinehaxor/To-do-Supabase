'use server';

import { readUserSession } from '@/lib/actions';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function createMember(data: { name: string; role: 'admin' | 'user'; status: 'active' | 'resigned'; email: string; password: string; confirm: string }) {
   const { data: userSession } = await readUserSession();
   if (userSession.session?.user.user_metadata.role !== 'admin') {
      return JSON.stringify({ error: { message: 'Only admin area' } });
   }

   const supabase = await createSupabaseAdmin();

   //create account
   const createResult = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
         role: data.role,
      },
   });

   if (createResult.error?.message) {
      return JSON.stringify(createResult);
   } else {
      const memberResult = await supabase.from('member').insert({
         name: data.name,
         id: createResult.data.user?.id,
      });

      if (memberResult.error?.message) {
         return JSON.stringify(memberResult);
      } else {
         const permissionResult = await supabase.from('permission').insert({
            role: data.role,
            member_id: createResult.data.user?.id,
            status: data.status,
         });
         return JSON.stringify(permissionResult);
      }
   }

   //create member
   //create permission
}
export async function updateMemberById(id: string) {
   console.log('update member');
}
export async function deleteMemberById(id: string) {}
export async function readMembers() {}
