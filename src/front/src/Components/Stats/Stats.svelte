<script lang="ts">
  import { _ } from "svelte-i18n";
  import Section from "../Section.svelte";
  import type { IProject } from "../../types";

  export let project: IProject;
  console.log(project);
  const headerActions = [];
</script>

<div class="container">
  <Section
    icon_code="bar_chart"
    title={$_("statistics.statistics")}
    actions={headerActions}
    padding={{ value: 0, unit: "px" }}
  >
    <div class="content">
      <!-- <p>({$_("not_available_yet")}...)</p> -->
      <div class="selection-tools">
        <Section
          icon_code="rule"
          title={"Task selection tools"}
          actions={[]}
          main={false}
        >
          <!--  -->
          <div class="presets">presets</div>
          <div class="time-range">time range</div>
          <div class="tags-included">tags included</div>
          <div class="tags-excluded">tags excluded</div>
          <!-- </div> -->
        </Section>
      </div>
      <div class="statistics">
        <p>({$_("not_available_yet")}...)</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro iusto
          laboriosam error laborum blanditiis, repellendus eum? Explicabo, amet
          iste error hic veniam molestias magnam, ullam ab maxime perspiciatis,
          voluptate voluptates. Iusto a sint in provident fugiat dolor deleniti
          esse delectus itaque officia laborum saepe, incidunt adipisci
          doloribus ipsum velit earum, cum laboriosam. Quaerat laborum a, et
          dolor quis nam facere natus facilis numquam, qui labore. Nihil
          consequatur iste atque debitis voluptatibus, ut sit possimus
          exercitationem, harum a doloremque delectus quaerat! Est amet deleniti
          quidem totam at minus, architecto corrupti enim nam nesciunt,
          voluptatibus mollitia voluptas aliquid fugit impedit tenetur incidunt.
          Itaque ex aliquid nam in corporis dolor debitis sint magnam odio
          atque. Aut corporis rem exercitationem reprehenderit quisquam quia
          eligendi omnis inventore doloribus, voluptates a vel cum, minima vitae
          consequuntur maiores blanditiis odio ut voluptate sit? Perferendis
          iure, voluptatem ipsum laudantium provident tenetur ipsam asperiores
          aliquam numquam, possimus distinctio quaerat cumque officiis quam
          nihil saepe optio modi ab minima. Nihil delectus molestiae deleniti,
          veritatis dolorum, placeat quasi officia dolorem, magni ea ut. Odit
          animi consequatur ea reprehenderit quia reiciendis ut eos deserunt?
          Neque repudiandae quae iure dicta magnam accusamus alias rem,
          voluptatem ea voluptates! Repellendus vero asperiores sunt, saepe id
          hic perspiciatis! Omnis sint, eum tenetur quam accusantium ex quos
          dicta cupiditate adipisci doloremque, dolorum nisi consectetur alias
          culpa, reiciendis illum molestiae porro. Perspiciatis, totam maxime
          explicabo iusto nemo ipsa veniam dolorem amet, ab aliquid praesentium
          voluptatibus possimus pariatur ullam nulla sit delectus ipsum. Fuga
          eius, accusamus commodi aperiam sequi dolores amet et ipsam eligendi
          facilis delectus iusto neque ducimus incidunt atque illo rerum, sunt
          dolorum ratione quaerat sint iure ea. Similique sequi tempora illo
          libero in modi, ex consequatur sint qui quod numquam aliquam provident
          corrupti recusandae nesciunt, debitis, mollitia eligendi quisquam et
          commodi porro maxime odit ullam. Veritatis libero quis blanditiis, ut
          distinctio facilis id iusto voluptatibus, suscipit, repellendus harum
          perspiciatis tempore quam maiores deleniti doloribus ea iure
          consequuntur consequatur dicta est? Fugit quasi beatae laboriosam
          eligendi, consequatur deserunt vero animi laudantium voluptatibus
          saepe mollitia numquam similique odit quisquam quis excepturi. Cumque
          autem facilis eius necessitatibus voluptatem tempore impedit alias
          iusto libero culpa provident laudantium totam accusantium, velit
          aspernatur a, dolores nam accusamus, blanditiis odio consequuntur?
          Omnis in aperiam dignissimos, iste aliquam quos esse rem similique
          veniam cum est perspiciatis fuga voluptates saepe architecto
          reprehenderit suscipit nisi officiis asperiores veritatis officia quis
          fugit exercitationem odio! Repudiandae ullam sint culpa deleniti
          aspernatur explicabo provident architecto ipsa molestias esse nobis,
          blanditiis quae reiciendis dicta repellendus nesciunt vero facere illo
          cumque sit aperiam. Corporis exercitationem eos debitis dolores fugit
          ad eum voluptatum ipsa dignissimos rerum sunt accusamus, sequi soluta,
          molestias iusto molestiae itaque excepturi optio hic? Esse, unde
          libero illum, explicabo repellat dignissimos voluptatibus voluptates
          vero quidem aliquid tempore, labore quis veritatis! Omnis veritatis
          delectus obcaecati labore odit, repudiandae consectetur aliquid sunt
          esse reprehenderit vitae, at voluptates beatae eveniet sequi
          voluptatibus consequatur tenetur eos! Quasi officiis amet eligendi,
          dolorem magnam odio odit cumque itaque. Totam veritatis reiciendis
          sequi doloribus deserunt impedit velit, eum deleniti, quisquam modi
          rem, quod cum sit error repudiandae nisi sunt nulla! Quasi ipsam,
          dolorum doloremque eum magni explicabo optio perspiciatis, nulla culpa
          voluptatem accusantium eligendi aliquid alias veritatis assumenda
          ratione, omnis reiciendis provident. Fuga ipsa omnis illo, iure a non
          aliquam expedita saepe necessitatibus dolor ducimus, commodi quo.
          Facilis pariatur odio amet veritatis voluptatem in cumque quo aut
          magnam dolor expedita tempora laborum suscipit, obcaecati labore nemo
          laudantium nulla illo porro earum velit est incidunt neque assumenda.
          Natus unde mollitia exercitationem laudantium sit. Quis expedita
          ratione atque facilis, veniam incidunt doloremque vero cum repellendus
          consequuntur labore cumque reiciendis ducimus, quo fugit rem dicta vel
          quos, veritatis quae officia consectetur amet soluta. Aspernatur iste
          necessitatibus possimus magnam tempora, optio officiis recusandae,
          cupiditate, non deleniti natus id pariatur blanditiis dolorem
          laudantium. Ab optio ea atque. Similique doloremque, fugit commodi
          facilis eius ipsa obcaecati hic harum veniam quibusdam tenetur
          perspiciatis dolores vitae pariatur qui tempora sapiente at a
          provident beatae excepturi omnis dolor laboriosam officiis? Libero aut
          corrupti illum alias est accusamus, reprehenderit praesentium quod
          adipisci exercitationem. Possimus saepe libero nisi quos, similique
          iure facere eveniet, enim mollitia omnis ex magnam incidunt, maiores
          quam alias ut soluta nostrum nobis consequuntur inventore minus
          corporis? Animi ab eveniet, dolor officia deleniti impedit tenetur
          deserunt fugit molestias nostrum atque ut, neque, totam cum? Commodi
          itaque ad a corporis iusto saepe? Tempora eius doloribus nihil
          explicabo tempore aut recusandae veniam quam, qui, officiis rem illum
          provident esse deleniti cum perferendis ea ullam sit ratione obcaecati
          necessitatibus! Et omnis deserunt totam amet, tempora eveniet
          voluptates fuga, consectetur autem dolores eligendi officiis ea maxime
          architecto ipsa animi ex consequatur, voluptatum unde. Possimus dolor
          quidem quasi odio sit quisquam pariatur cupiditate provident doloribus
          labore dignissimos velit animi id sapiente voluptatibus iusto quis
          quae harum enim perferendis ullam, amet sint ipsa sunt! Repellendus
          velit eum quae cumque possimus ratione nesciunt delectus atque minus
          facilis. Similique, nobis. Nobis ut est voluptatibus maiores dicta et
          praesentium sapiente quaerat delectus nemo, quidem vel id similique,
          corporis ad, minus alias iure repellat cumque blanditiis. Assumenda,
          corporis officiis harum quae suscipit dicta sint adipisci qui, rerum
          maxime ab dolor, neque expedita quo? Sapiente harum quae voluptatum
          rem expedita. Quos ullam numquam officia dicta mollitia, nemo ab quae
          rem architecto eos natus illum porro, tenetur eius, atque deserunt
          quis minus praesentium. Libero, perspiciatis odio iusto itaque
          dignissimos magni ipsa explicabo autem nemo molestiae, optio ipsum
          officiis? Minus inventore voluptas a possimus consectetur voluptatibus
          voluptate repellat est adipisci tempora saepe fuga consequatur nulla
          alias, fugit ipsum dicta, nemo repellendus rem perspiciatis, at hic!
          Voluptas, temporibus officiis deserunt tempore maiores sapiente omnis
          sequi cumque adipisci quos vel ex assumenda quibusdam quae fuga
          accusantium eaque ad expedita dolore doloribus. Iure inventore
          officiis odit esse! Debitis enim modi dolorem necessitatibus neque
          officiis sed quia. Eum ipsa, sit quos, unde cum rerum aut, minima
          veritatis exercitationem sapiente iure at sint sunt incidunt tenetur!
          Quae vitae expedita quibusdam, quod eius neque ipsa commodi? Debitis,
          velit dolorem eligendi atque delectus consequatur?
        </p>
      </div>
    </div>
  </Section>
</div>

<style>
  .container {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .content {
    display: flex;
    position: absolute;
    inset: 0;
  }
  .statistics {
    overflow: auto;
    padding: 0.5rem;
  }
</style>
