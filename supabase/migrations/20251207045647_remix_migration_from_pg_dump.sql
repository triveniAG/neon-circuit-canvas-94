CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



SET default_table_access_method = heap;

--
-- Name: circuit_components; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.circuit_components (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    symbol text,
    definition text NOT NULL,
    application text NOT NULL,
    why_used text NOT NULL,
    image_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: scan_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scan_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    image_url text,
    detected_components jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: circuit_components circuit_components_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.circuit_components
    ADD CONSTRAINT circuit_components_name_key UNIQUE (name);


--
-- Name: circuit_components circuit_components_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.circuit_components
    ADD CONSTRAINT circuit_components_pkey PRIMARY KEY (id);


--
-- Name: scan_results scan_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scan_results
    ADD CONSTRAINT scan_results_pkey PRIMARY KEY (id);


--
-- Name: scan_results Anyone can create scan results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create scan results" ON public.scan_results FOR INSERT WITH CHECK (true);


--
-- Name: circuit_components Anyone can read circuit components; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read circuit components" ON public.circuit_components FOR SELECT USING (true);


--
-- Name: scan_results Anyone can read scan results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read scan results" ON public.scan_results FOR SELECT USING (true);


--
-- Name: circuit_components; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.circuit_components ENABLE ROW LEVEL SECURITY;

--
-- Name: scan_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


