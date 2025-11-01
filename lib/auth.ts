import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { query } from './db';
import { Usuario } from '@/types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        cedula: { label: "Cédula", type: "text", placeholder: "123456789" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.cedula || !credentials?.password) {
          throw new Error('Por favor ingresa cédula y contraseña');
        }

        try {
          // Buscar usuario por cédula
          const usuarios = await query<Usuario[]>(
            'SELECT * FROM usuarios WHERE cedula = ? AND activo = true',
            [credentials.cedula]
          );

          if (!usuarios || usuarios.length === 0) {
            throw new Error('Cédula o contraseña incorrecta');
          }

          const usuario = usuarios[0];

          // Verificar contraseña
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            usuario.password || ''
          );

          if (!passwordMatch) {
            throw new Error('Cédula o contraseña incorrecta');
          }

          // Retornar usuario sin password
          return {
            id: usuario.id.toString(),
            cedula: usuario.cedula,
            name: `${usuario.nombres} ${usuario.apellidos}`,
            email: usuario.cedula, // NextAuth requiere email
            rol: usuario.rol,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
          };
        } catch (error: any) {
          console.error('Error en authorize:', error);
          throw new Error(error.message || 'Error al iniciar sesión');
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Cuando el usuario inicia sesión
      if (user) {
        token.id = user.id;
        token.cedula = user.cedula;
        token.rol = user.rol;
        token.nombres = user.nombres;
        token.apellidos = user.apellidos;
      }

      // Permitir actualizar la sesión desde el cliente
      if (trigger === 'update' && session) {
        return { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      // Agregar información personalizada a la sesión
      if (session.user) {
        session.user.id = token.id;
        session.user.cedula = token.cedula;
        session.user.rol = token.rol;
        session.user.nombres = token.nombres;
        session.user.apellidos = token.apellidos;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirigir según el rol después del login
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === 'development',
};