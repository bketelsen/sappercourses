<script>
  import Tag from "./Tag.svelte";
  export let resource;
  export let selectedTags;
  export let toggleTag;
</script>

<style>
  .name code {
    font-size: inherit;
    padding: 0.2em 0.4em;
    /* this is `--prime` with reduced opacity */
    background-color: rgba(21, 151, 148, 0.07);
  }
</style>

<h4>
  <a class="name" href={resource.url} target="_blank">
    {#if resource.isNpmPackage}
      <code>{resource.name}</code>
    {:else}{resource.name}{/if}
  </a>
</h4>
{#if resource.description}
  <div>{resource.description}</div>
{/if}
<div>
  {#each resource.tags as tag}
    <Tag name={tag} selected={selectedTags.has(tag)} toggle={toggleTag} />
  {/each}
  {#if resource.isNpmPackage}
    <small>
      <a href="https://www.npmjs.com/package/{resource.name}" target="_blank">
        npm
      </a>
    </small>
  {/if}
</div>
