import type { ReactNode } from "react";

import { CloudflareStreamUpload } from "@/components/admin/content/cloudflare-stream-upload";
import { builderUpdateTypes } from "@/lib/services/builder-updates";

type FormAction = (formData: FormData) => void | Promise<void>;

type ProductOption = {
  id: string;
  name: string;
  slug: string;
};

type ProgramOption = {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
};

type ModuleOption = {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
  program: {
    id: string;
    title: string;
  };
};

type ProgramFormValue = {
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  productId?: string | null;
  isPublished?: boolean;
};

type ModuleFormValue = {
  programId?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
};

type LessonFormValue = {
  id?: string | null;
  programId?: string | null;
  moduleId?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  videoProvider?: string | null;
  streamVideoId?: string | null;
  videoStatus?: string | null;
  videoTitle?: string | null;
  videoThumbnailUrl?: string | null;
  videoDuration?: number | null;
  isPreview?: boolean;
  sortOrder?: number;
  isPublished?: boolean;
};

type BuilderUpdateFormValue = {
  title?: string | null;
  type?: string | null;
  summary?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  isPublished?: boolean;
};

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-sm font-semibold text-neutral-700">{children}</span>;
}

function TextInput({
  name,
  defaultValue,
  required = false,
  placeholder,
}: {
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      name={name}
      required={required}
      defaultValue={defaultValue ?? ""}
      placeholder={placeholder}
      className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
    />
  );
}

function TextArea({
  name,
  defaultValue,
  rows = 4,
  required = false,
  placeholder,
}: {
  name: string;
  defaultValue?: string | null;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <textarea
      name={name}
      required={required}
      rows={rows}
      defaultValue={defaultValue ?? ""}
      placeholder={placeholder}
      className="w-full rounded-md border border-border bg-background px-3 py-3 text-sm leading-6 outline-none transition focus:border-accent"
    />
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
    >
      {label}
    </button>
  );
}

function PublishCheckbox({ defaultChecked }: { defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-3">
      <input
        type="checkbox"
        name="isPublished"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[var(--accent)]"
      />
      <span className="text-sm font-semibold text-foreground">Publicado</span>
    </label>
  );
}

function PreviewCheckbox({ defaultChecked }: { defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-3">
      <input
        type="checkbox"
        name="isPreview"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[var(--accent)]"
      />
      <span className="text-sm font-semibold text-foreground">
        Video preview
      </span>
    </label>
  );
}

export function ProgramForm({
  action,
  products,
  program,
  submitLabel,
}: {
  action: FormAction;
  products: ProductOption[];
  program?: ProgramFormValue | null;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-2">
        <FieldLabel>Titulo</FieldLabel>
        <TextInput
          name="title"
          required
          defaultValue={program?.title}
          placeholder="Build IdeaCash — Founder Access"
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Slug</FieldLabel>
        <TextInput
          name="slug"
          required
          defaultValue={program?.slug}
          placeholder="build-ideacash-founder-access"
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Producto asociado</FieldLabel>
        <select
          name="productId"
          defaultValue={program?.productId ?? ""}
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
        >
          <option value="">Sin producto asociado</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <FieldLabel>Descripcion</FieldLabel>
        <TextArea
          name="description"
          defaultValue={program?.description}
          placeholder="Describe la promesa y alcance del programa."
        />
      </label>

      <PublishCheckbox defaultChecked={program?.isPublished} />

      <SubmitButton label={submitLabel} />
    </form>
  );
}

export function ModuleForm({
  action,
  programs,
  module,
  submitLabel,
}: {
  action: FormAction;
  programs: ProgramOption[];
  module?: ModuleFormValue | null;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-2">
        <FieldLabel>Programa</FieldLabel>
        <select
          name="programId"
          required
          defaultValue={module?.programId ?? ""}
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
        >
          <option value="">Selecciona un programa</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.title}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
        <label className="block space-y-2">
          <FieldLabel>Titulo</FieldLabel>
          <TextInput
            name="title"
            required
            defaultValue={module?.title}
            placeholder="Claridad de oferta"
          />
        </label>
        <label className="block space-y-2">
          <FieldLabel>Orden</FieldLabel>
          <TextInput name="sortOrder" defaultValue={`${module?.sortOrder ?? 0}`} />
        </label>
      </div>

      <label className="block space-y-2">
        <FieldLabel>Slug</FieldLabel>
        <TextInput
          name="slug"
          required
          defaultValue={module?.slug}
          placeholder="claridad-de-oferta"
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Descripcion</FieldLabel>
        <TextArea
          name="description"
          defaultValue={module?.description}
          placeholder="Objetivo breve del modulo."
        />
      </label>

      <PublishCheckbox defaultChecked={module?.isPublished} />

      <SubmitButton label={submitLabel} />
    </form>
  );
}

export function LessonForm({
  action,
  programs,
  modules,
  lesson,
  submitLabel,
}: {
  action: FormAction;
  programs: ProgramOption[];
  modules: ModuleOption[];
  lesson?: LessonFormValue | null;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block space-y-2">
          <FieldLabel>Programa</FieldLabel>
          <select
            name="programId"
            required
            defaultValue={lesson?.programId ?? ""}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="">Selecciona un programa</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <FieldLabel>Modulo</FieldLabel>
          <select
            name="moduleId"
            required
            defaultValue={lesson?.moduleId ?? ""}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="">Selecciona un modulo</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.program.title} / {module.sortOrder}. {module.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
        <label className="block space-y-2">
          <FieldLabel>Titulo</FieldLabel>
          <TextInput
            name="title"
            required
            defaultValue={lesson?.title}
            placeholder="Mapa de idea a oferta"
          />
        </label>
        <label className="block space-y-2">
          <FieldLabel>Orden</FieldLabel>
          <TextInput name="sortOrder" defaultValue={`${lesson?.sortOrder ?? 0}`} />
        </label>
      </div>

      <label className="block space-y-2">
        <FieldLabel>Slug</FieldLabel>
        <TextInput
          name="slug"
          required
          defaultValue={lesson?.slug}
          placeholder="mapa-de-idea-a-oferta"
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Descripcion</FieldLabel>
        <TextArea
          name="description"
          defaultValue={lesson?.description}
          placeholder="Resumen claro de la leccion."
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Contenido base</FieldLabel>
        <TextArea
          name="content"
          rows={8}
          defaultValue={lesson?.content}
          placeholder="Contenido textual que vera el usuario."
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Video URL externa opcional</FieldLabel>
        <TextInput
          name="videoUrl"
          defaultValue={lesson?.videoUrl}
          placeholder="https://youtube.com/watch?v=..."
        />
        <span className="text-xs leading-5 text-neutral-500">
          Campo de compatibilidad. El flujo principal del LMS usa Cloudflare
          Stream.
        </span>
      </label>

      <div className="rounded-xl border border-border bg-surface-muted p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Video de la lección
          </p>
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Este es el punto principal de carga y configuración del video. La
            biblioteca de Videos solo sirve para revisar videos ya vinculados.
          </p>
        </div>

        <div className="mt-4">
          <CloudflareStreamUpload
            lessonId={lesson?.id}
            lessonTitle={lesson?.title}
            streamVideoId={lesson?.streamVideoId}
            videoStatus={lesson?.videoStatus}
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="block space-y-2">
            <FieldLabel>Proveedor</FieldLabel>
            <select
              name="videoProvider"
              defaultValue={lesson?.videoProvider ?? ""}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
            >
              <option value="">Sin proveedor</option>
              <option value="YouTube">YouTube</option>
              <option value="Vimeo">Vimeo</option>
              <option value="Loom">Loom</option>
              <option value="Mux">Mux</option>
              <option value="Directo">Archivo directo</option>
            </select>
          </label>

          <label className="block space-y-2">
            <FieldLabel>Título del video</FieldLabel>
            <TextInput
              name="videoTitle"
              defaultValue={lesson?.videoTitle}
              placeholder="Introducción al build"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_180px]">
          <label className="block space-y-2">
            <FieldLabel>Thumbnail opcional</FieldLabel>
            <TextInput
              name="videoThumbnailUrl"
              defaultValue={lesson?.videoThumbnailUrl}
              placeholder="https://..."
            />
          </label>

          <label className="block space-y-2">
            <FieldLabel>Duración en segundos</FieldLabel>
            <TextInput
              name="videoDuration"
              defaultValue={
                lesson?.videoDuration != null ? `${lesson.videoDuration}` : ""
              }
              placeholder="420"
            />
          </label>
        </div>

        <div className="mt-4">
          <PreviewCheckbox defaultChecked={lesson?.isPreview} />
        </div>
      </div>

      <PublishCheckbox defaultChecked={lesson?.isPublished} />

      <SubmitButton label={submitLabel} />
    </form>
  );
}

export function BuilderUpdateForm({
  action,
  update,
  submitLabel,
}: {
  action: FormAction;
  update?: BuilderUpdateFormValue | null;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-2">
        <FieldLabel>Título</FieldLabel>
        <TextInput
          name="title"
          required
          defaultValue={update?.title}
          placeholder="Nueva lección publicada dentro de Builder"
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Tipo</FieldLabel>
        <select
          name="type"
          defaultValue={update?.type ?? "NOVEDAD"}
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
        >
          {builderUpdateTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <FieldLabel>Resumen</FieldLabel>
        <TextArea
          name="summary"
          required
          rows={3}
          defaultValue={update?.summary}
          placeholder="Una síntesis clara para el feed privado."
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Contenido</FieldLabel>
        <TextArea
          name="content"
          required
          rows={8}
          defaultValue={update?.content}
          placeholder="Desarrolla la novedad, tip o recomendación con criterio práctico."
        />
      </label>

      <label className="block space-y-2">
        <FieldLabel>Imagen opcional</FieldLabel>
        <TextInput
          name="imageUrl"
          defaultValue={update?.imageUrl}
          placeholder="https://..."
        />
      </label>

      <PublishCheckbox defaultChecked={update?.isPublished} />

      <SubmitButton label={submitLabel} />
    </form>
  );
}
