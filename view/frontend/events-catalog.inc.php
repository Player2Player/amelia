<div class="et_pb_with_border et_pb_module et_pb_text et_pb_text_1  et_pb_text_align_left et_pb_bg_layout_light">
	<div class="et_pb_text_inner">
		<h2>Select your clinic or event and register</h2>
		<?php
      foreach($data['events'] as $locationId => $events) {        
        if ($locationId === -1 && empty($events)) continue;
      
        $location = $data['locations'][$locationId];
    ?>
    <h4>
			<strong><?php echo $location ?> Events:</strong>
    </h4>
    <ul>
      <?php
        foreach($events as $event) {            
      ?>
        <li>
          <a href="/event-detail/<?php echo $event->getSlug()->getValue() ?>">
            <strong><?php echo $event->getName()->getValue() ?>: </strong>
          </a>
          <?php echo $event->getDescription() ? self::strLimit($event->getDescription()->getValue(), 120) : '' ?>
        </li>  
      <?php } ?>
    </ul>
    <?php } ?>
	</div>
</div>