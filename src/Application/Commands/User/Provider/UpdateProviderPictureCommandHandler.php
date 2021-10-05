<?php

namespace AmeliaBooking\Application\Commands\User\Provider;

use AmeliaBooking\Application\Common\Exceptions\AccessDeniedException;
use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\Entities;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\User\ProviderRepository;

/**
 * Class UpdateProviderPictureCommandHandler
 *
 * @package AmeliaBooking\Application\Common
 */
class UpdateProviderPictureCommandHandler extends CommandHandler
{
  

    /**
     * @param UpdateProviderPictureCommand $command
     *
     * @return CommandResult
     * @throws \Slim\Exception\ContainerException
     * @throws \InvalidArgumentException
     * @throws \Slim\Exception\ContainerValueNotFoundException
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     * @throws AccessDeniedException
     * @throws \Interop\Container\Exception\ContainerException
     */
    public function handle(UpdateProviderPictureCommand $command)
    {
        if (!$this->getContainer()->getPermissionsService()->currentUserCanWrite(Entities::EMPLOYEES)) {
            throw new AccessDeniedException('You are not allowed to update employee.');
        }
        
        /** @var int $providerId */
        $providerId = (int)$command->getField('id');

        $file = $command->getFile();

        $this->validateFile($file);
        
        $result = new CommandResult();

        /** @var ProviderRepository $providerRepository */
        $providerRepository = $this->container->get('domain.users.providers.repository');

        $attachId = $this->insertAttachment($file);
        //$providerRepository->updateFieldById($command->getArg('id'), $command->getField('status'), 'status');
        
        $thumbnailImageUrl = wp_get_attachment_image_src($attachId);
        $fullImageUrl = wp_get_attachment_image_src($attachId, 'full');
        
        $result->setResult(CommandResult::RESULT_SUCCESS);
        $result->setMessage('Successfully updated picture profile');
        $result->setData([
          "providerId" => $providerId,
          "thumbnail" => $thumbnailImageUrl,
          "fullImageUrl" => $fullImageUrl,
        ]);

        return $result;
    }


    public function validateFile($file) 
    {
      $validTypes = [
        'image/bmp',
        'image/gif',
        'image/jpeg',
        'image/png',
      ];

      if ($file["error"] !== 0) 
        throw new InvalidArgumentException("The file is invalid");

      if ($file["size"] / 1024 / 1024 > 2) 
        throw new InvalidArgumentException("The file size {$file['size']} exceed 2MB");

      if (!in_array($file["type"], $validTypes)) 
        throw new InvalidArgumentException("The file type {$file['type']} must be an image");      

      return true;  
    }

    /**
     * Insert the attachment.
     *
     * @param  Array  $file
     * @return Int    Attachment ID
     */
    public function insertAttachment($file) 
    {

      $fileContent = file_get_contents($file["tmp_name"]);
      $date = new \DateTime();
      $subpath = $date->format('Y/m');
      
      $upload = wp_upload_bits($file["name"], null, $fileContent, $subpath);

      $filePath = $upload['file'];
      $fileName = basename($filePath);
      $fileType = wp_check_filetype( $fileName, null );
      $attachmentTitle = sanitize_file_name( pathinfo( $fileName, PATHINFO_FILENAME ) );
      $wpUploadDir = wp_upload_dir();

      $postInfo = array(
        'guid'           => $wpUploadDir['url'] . '/' . $fileName,
        'post_mime_type' => $fileType['type'],
        'post_title'     => $attachmentTitle,
        'post_content'   => '',
        'post_status'    => 'inherit',
      );

      // Create the attachment
      $attachId = wp_insert_attachment($postInfo, $filePath, null);

      // Include image.php
      require_once( ABSPATH . 'wp-admin/includes/image.php' );

      // Define attachment metadata
      $attach_data = wp_generate_attachment_metadata( $attachId, $filePath );

      // Assign metadata to attachment
      wp_update_attachment_metadata( $attachId,  $attach_data );

      return $attachId;

    }    
}
