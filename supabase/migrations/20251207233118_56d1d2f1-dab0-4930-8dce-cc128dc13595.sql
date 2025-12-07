-- 1. Enum para roles
CREATE TYPE public.app_role AS ENUM ('user', 'vendor', 'admin');

-- 2. Tabla de roles (separada por seguridad)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Perfil extendido para vendedores
CREATE TABLE public.vendor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    business_name TEXT,
    slug TEXT UNIQUE,
    logo_url TEXT,
    phone TEXT,
    whatsapp TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    primary_color TEXT DEFAULT '#0C8CE9',
    secondary_color TEXT DEFAULT '#2DB87B',
    is_public BOOLEAN DEFAULT false,
    nickname TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Función SECURITY DEFINER para verificar roles (evita recursión RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Políticas RLS para user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role on signup"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 6. Políticas RLS para vendor_profiles
CREATE POLICY "Vendors can view own profile"
ON public.vendor_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Vendors can update own profile"
ON public.vendor_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Vendors can insert own profile"
ON public.vendor_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable by all"
ON public.vendor_profiles FOR SELECT
USING (is_public = true);

-- 7. Trigger para updated_at en vendor_profiles
CREATE TRIGGER update_vendor_profiles_updated_at
BEFORE UPDATE ON public.vendor_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();