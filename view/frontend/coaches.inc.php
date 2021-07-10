<div class="et_pb_column et_pb_column_4_4 et_pb_column_1  et_pb_css_mix_blend_mode_passthrough et-last-child">
  <div class="et_pb_module et_pb_text et_pb_text_1  et_pb_text_align_center et_pb_bg_layout_light">
    <div class="et_pb_text_inner">
      <h1>
        <?php echo strtoupper($data['location']['name']) ?>: <?php echo $data['category'] ? strtoupper($data['category']['name']) : 'ALL COACHES' ?>
      </h1>
      <h2>A view of all current <?php echo $data['location']['name'] ?><?php echo $data['category'] ? ' '.strtolower($data['category']['name']) : '' ?> coaches</h2>
      <p>Click on a coach to learn more, see when they are available, and book a coaching session.</p>
    </div>    
  </div>
  <div class="et_pb_module et_pb_portfolio_0 et_pb_bg_layout_light et_pb_portfolio_grid clearfix">
    <div class="et_pb_ajax_pagination_container">
      <div class="et_pb_portfolio_grid_items">
        <?php foreach($data['coaches'] as $id => $item) { ?>         
        <div id="post-<?php echo $id?>" class="et_pb_portfolio_item et_pb_grid_item">
          <?php $fullName = "{$item->getFirstName()->getValue()} {$item->getLastName()->getValue()}" ?>
          <a href="https://staging.player2player.com/project/aidan-albright/"
              title="<?php echo $fullName ?>">
            <span class="et_portfolio_image">
              <img loading="lazy"
                    src="https://staging.player2player.com/wp-content/uploads/2020/10/Aiden-Albright-2-400x284.png"
                    alt="<?php echo $fullName ?>"
                    width="400"
                    height="284"
                    srcset="https://staging.player2player.com/wp-content/uploads/2020/10/Aiden-Albright-2.png 479w, https://staging.player2player.com/wp-content/uploads/2020/10/Aiden-Albright-2-400x284.png 480w"
                    sizes="(max-width:479px) 479px, 100vw">
              <span class="et_overlay"/>
            </span>
          </a>
          <h2 class="et_pb_module_header">
            <a href="https://staging.player2player.com/project/aidan-albright/"
                title="<?php echo $fullName ?>"><?php echo $fullName ?></a>
          </h2>
          <p class="post-meta">
            <a href="https://staging.player2player.com/project_category/football-lt/"
                title="Football">Football</a>,<a href="https://staging.player2player.com/project_category/soccer-lt/"
                title="Soccer">Soccer</a>,<a href="https://staging.player2player.com/project_category/track-lt/"
                title="Track">Track</a>
          </p>
        </div>
        <?php } ?>
      </div>
    </div>
  </div>      
</div>
