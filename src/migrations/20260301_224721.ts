import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_uloga" AS ENUM('vlasnik', 'mehanicar', 'pomocni');
  CREATE TYPE "public"."enum_services_service_type" AS ENUM('mali-servis', 'veliki-servis', 'popravka-kvara', 'dijagnostika', 'limarija-ostalo');
  CREATE TYPE "public"."enum_services_payment_status" AS ENUM('placeno', 'nije-placeno', 'delimisno-placeno');
  CREATE TYPE "public"."enum_services_payment_method" AS ENUM('gotovina', 'kartica', 'virman');
  CREATE TYPE "public"."enum_tools_condition" AS ENUM('ispravno', 'na-servisu', 'neispravno', 'rashodovano');
  CREATE TYPE "public"."enum_media_tip" AS ENUM('slika-vozila', 'slika-kvara', 'racun', 'ostalo');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ime" varchar NOT NULL,
  	"uloga" "enum_users_uloga" DEFAULT 'vlasnik' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"address" varchar,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vehicles_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "vehicles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" integer NOT NULL,
  	"brand" varchar,
  	"model" varchar NOT NULL,
  	"year" numeric,
  	"registration_number" varchar,
  	"vin" varchar NOT NULL,
  	"engine" varchar,
  	"fuel_type" varchar,
  	"engine_capacity" varchar,
  	"power" varchar,
  	"color" varchar,
  	"current_mileage" numeric,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_parts_used" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"part_name" varchar,
  	"brand" varchar,
  	"part_code" varchar,
  	"quantity" numeric,
  	"purchase_price" numeric,
  	"sale_price" numeric,
  	"supplier" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "services_parts_invoice_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "services_issue_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "services_after_repair_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"vehicle_id" integer NOT NULL,
  	"client_id" integer,
  	"client_snapshot_name" varchar,
  	"service_type" "enum_services_service_type" NOT NULL,
  	"service_date" timestamp(3) with time zone NOT NULL,
  	"mileage" numeric NOT NULL,
  	"description" varchar NOT NULL,
  	"labor_price" numeric,
  	"parts_price" numeric,
  	"total_price" numeric,
  	"payment_status" "enum_services_payment_status",
  	"payment_method" "enum_services_payment_method",
  	"internal_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "part_purchases_invoice_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "part_purchases_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"code" varchar,
  	"quantity" numeric,
  	"unit_price" numeric,
  	"total" numeric
  );
  
  CREATE TABLE "part_purchases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"purchase_date" timestamp(3) with time zone,
  	"supplier" varchar,
  	"invoice_number" varchar,
  	"total_amount" numeric,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tools_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "tools" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"category" varchar,
  	"description" varchar,
  	"serial_number" varchar,
  	"purchase_date" timestamp(3) with time zone,
  	"purchase_price" numeric,
  	"location_in_workshop" varchar,
  	"condition" "enum_tools_condition" DEFAULT 'ispravno',
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"tip" "enum_media_tip",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"clients_id" integer,
  	"vehicles_id" integer,
  	"services_id" integer,
  	"part_purchases_id" integer,
  	"tools_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles_gallery" ADD CONSTRAINT "vehicles_gallery_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vehicles_gallery" ADD CONSTRAINT "vehicles_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_parts_used" ADD CONSTRAINT "services_parts_used_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_parts_invoice_files" ADD CONSTRAINT "services_parts_invoice_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_parts_invoice_files" ADD CONSTRAINT "services_parts_invoice_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_issue_images" ADD CONSTRAINT "services_issue_images_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_issue_images" ADD CONSTRAINT "services_issue_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_after_repair_images" ADD CONSTRAINT "services_after_repair_images_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_after_repair_images" ADD CONSTRAINT "services_after_repair_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "part_purchases_invoice_files" ADD CONSTRAINT "part_purchases_invoice_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "part_purchases_invoice_files" ADD CONSTRAINT "part_purchases_invoice_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."part_purchases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "part_purchases_items" ADD CONSTRAINT "part_purchases_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."part_purchases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tools_images" ADD CONSTRAINT "tools_images_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tools_images" ADD CONSTRAINT "tools_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vehicles_fk" FOREIGN KEY ("vehicles_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_part_purchases_fk" FOREIGN KEY ("part_purchases_id") REFERENCES "public"."part_purchases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tools_fk" FOREIGN KEY ("tools_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "clients_first_name_idx" ON "clients" USING btree ("first_name");
  CREATE INDEX "clients_last_name_idx" ON "clients" USING btree ("last_name");
  CREATE INDEX "clients_phone_idx" ON "clients" USING btree ("phone");
  CREATE INDEX "clients_email_idx" ON "clients" USING btree ("email");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX "firstName_lastName_idx" ON "clients" USING btree ("first_name","last_name");
  CREATE INDEX "phone_idx" ON "clients" USING btree ("phone");
  CREATE INDEX "vehicles_gallery_order_idx" ON "vehicles_gallery" USING btree ("_order");
  CREATE INDEX "vehicles_gallery_parent_id_idx" ON "vehicles_gallery" USING btree ("_parent_id");
  CREATE INDEX "vehicles_gallery_file_idx" ON "vehicles_gallery" USING btree ("file_id");
  CREATE INDEX "vehicles_client_idx" ON "vehicles" USING btree ("client_id");
  CREATE INDEX "vehicles_brand_idx" ON "vehicles" USING btree ("brand");
  CREATE INDEX "vehicles_model_idx" ON "vehicles" USING btree ("model");
  CREATE INDEX "vehicles_registration_number_idx" ON "vehicles" USING btree ("registration_number");
  CREATE UNIQUE INDEX "vehicles_vin_idx" ON "vehicles" USING btree ("vin");
  CREATE INDEX "vehicles_updated_at_idx" ON "vehicles" USING btree ("updated_at");
  CREATE INDEX "vehicles_created_at_idx" ON "vehicles" USING btree ("created_at");
  CREATE UNIQUE INDEX "vin_idx" ON "vehicles" USING btree ("vin");
  CREATE INDEX "registrationNumber_idx" ON "vehicles" USING btree ("registration_number");
  CREATE INDEX "model_idx" ON "vehicles" USING btree ("model");
  CREATE INDEX "services_parts_used_order_idx" ON "services_parts_used" USING btree ("_order");
  CREATE INDEX "services_parts_used_parent_id_idx" ON "services_parts_used" USING btree ("_parent_id");
  CREATE INDEX "services_parts_invoice_files_order_idx" ON "services_parts_invoice_files" USING btree ("_order");
  CREATE INDEX "services_parts_invoice_files_parent_id_idx" ON "services_parts_invoice_files" USING btree ("_parent_id");
  CREATE INDEX "services_parts_invoice_files_file_idx" ON "services_parts_invoice_files" USING btree ("file_id");
  CREATE INDEX "services_issue_images_order_idx" ON "services_issue_images" USING btree ("_order");
  CREATE INDEX "services_issue_images_parent_id_idx" ON "services_issue_images" USING btree ("_parent_id");
  CREATE INDEX "services_issue_images_file_idx" ON "services_issue_images" USING btree ("file_id");
  CREATE INDEX "services_after_repair_images_order_idx" ON "services_after_repair_images" USING btree ("_order");
  CREATE INDEX "services_after_repair_images_parent_id_idx" ON "services_after_repair_images" USING btree ("_parent_id");
  CREATE INDEX "services_after_repair_images_file_idx" ON "services_after_repair_images" USING btree ("file_id");
  CREATE INDEX "services_vehicle_idx" ON "services" USING btree ("vehicle_id");
  CREATE INDEX "services_client_idx" ON "services" USING btree ("client_id");
  CREATE INDEX "services_client_snapshot_name_idx" ON "services" USING btree ("client_snapshot_name");
  CREATE INDEX "services_service_type_idx" ON "services" USING btree ("service_type");
  CREATE INDEX "services_service_date_idx" ON "services" USING btree ("service_date");
  CREATE INDEX "services_mileage_idx" ON "services" USING btree ("mileage");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "serviceDate_idx" ON "services" USING btree ("service_date");
  CREATE INDEX "serviceType_idx" ON "services" USING btree ("service_type");
  CREATE INDEX "mileage_idx" ON "services" USING btree ("mileage");
  CREATE INDEX "part_purchases_invoice_files_order_idx" ON "part_purchases_invoice_files" USING btree ("_order");
  CREATE INDEX "part_purchases_invoice_files_parent_id_idx" ON "part_purchases_invoice_files" USING btree ("_parent_id");
  CREATE INDEX "part_purchases_invoice_files_file_idx" ON "part_purchases_invoice_files" USING btree ("file_id");
  CREATE INDEX "part_purchases_items_order_idx" ON "part_purchases_items" USING btree ("_order");
  CREATE INDEX "part_purchases_items_parent_id_idx" ON "part_purchases_items" USING btree ("_parent_id");
  CREATE INDEX "part_purchases_purchase_date_idx" ON "part_purchases" USING btree ("purchase_date");
  CREATE INDEX "part_purchases_supplier_idx" ON "part_purchases" USING btree ("supplier");
  CREATE INDEX "part_purchases_invoice_number_idx" ON "part_purchases" USING btree ("invoice_number");
  CREATE INDEX "part_purchases_updated_at_idx" ON "part_purchases" USING btree ("updated_at");
  CREATE INDEX "part_purchases_created_at_idx" ON "part_purchases" USING btree ("created_at");
  CREATE INDEX "tools_images_order_idx" ON "tools_images" USING btree ("_order");
  CREATE INDEX "tools_images_parent_id_idx" ON "tools_images" USING btree ("_parent_id");
  CREATE INDEX "tools_images_file_idx" ON "tools_images" USING btree ("file_id");
  CREATE INDEX "tools_name_idx" ON "tools" USING btree ("name");
  CREATE INDEX "tools_category_idx" ON "tools" USING btree ("category");
  CREATE INDEX "tools_serial_number_idx" ON "tools" USING btree ("serial_number");
  CREATE INDEX "tools_updated_at_idx" ON "tools" USING btree ("updated_at");
  CREATE INDEX "tools_created_at_idx" ON "tools" USING btree ("created_at");
  CREATE INDEX "condition_idx" ON "tools" USING btree ("condition");
  CREATE INDEX "serialNumber_idx" ON "tools" USING btree ("serial_number");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX "payload_locked_documents_rels_vehicles_id_idx" ON "payload_locked_documents_rels" USING btree ("vehicles_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_part_purchases_id_idx" ON "payload_locked_documents_rels" USING btree ("part_purchases_id");
  CREATE INDEX "payload_locked_documents_rels_tools_id_idx" ON "payload_locked_documents_rels" USING btree ("tools_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "vehicles_gallery" CASCADE;
  DROP TABLE "vehicles" CASCADE;
  DROP TABLE "services_parts_used" CASCADE;
  DROP TABLE "services_parts_invoice_files" CASCADE;
  DROP TABLE "services_issue_images" CASCADE;
  DROP TABLE "services_after_repair_images" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "part_purchases_invoice_files" CASCADE;
  DROP TABLE "part_purchases_items" CASCADE;
  DROP TABLE "part_purchases" CASCADE;
  DROP TABLE "tools_images" CASCADE;
  DROP TABLE "tools" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_uloga";
  DROP TYPE "public"."enum_services_service_type";
  DROP TYPE "public"."enum_services_payment_status";
  DROP TYPE "public"."enum_services_payment_method";
  DROP TYPE "public"."enum_tools_condition";
  DROP TYPE "public"."enum_media_tip";`)
}
